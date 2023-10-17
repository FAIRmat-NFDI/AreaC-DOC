# Example - Creating a topology

This page demonstrates how to create a "standard" topology in H5MD-NOMAD. The demonstrated organization of molecules and monomers is identical to what other NOMAD parsers do to create a topology from native simulation files (e.g., outputs from Gromacs or Lammps). However, the user is free to deviate from this standard to create arbitrary organizations of particles, as described on the [Connectivity](../connectivity.md) page.

## Standard topology structure for bonded force fields

```
topology
├── molecule_group_1
│    ├── molecule_1
│    │      ├── monomer_group_1
│    │      │       ├── monomer_1
│    │      │       │       └── metadata for monomer_1
│    │      │       ├── monomer_2
│    │      │       │       └── metadata for monomer_2
│    │      │       ├── ...
│    │      ├── monomer_group_2
│    │      └── ...
│    ├── molecule_2
│    │      ├── ...
│    └── ...
└── molecule_group_2
│    ├── molecule_1
│    │      └── metadata for molecule_1
│    ├── molecule_2
│    │      └── metadata for molecule_2
│    │      └── ...
│    └── ...
└── ...
```
Here, the first level of organization is the "molecule group". Molecule groups contain molecules of the same type. In other words, `molecule_group_1` and `molecule_group_2` represent distinct molecule types. At the next level of the hierarchy, each molecule within this group is stored (i.e., `molecule_1`, `molecule_2`, etc.). In the above example, `molecule_group_1` represents a polymer (or protein). Thus, below the molecule level, there is a "monomer group level". Similar to the molecule group, the monomer group organizes all monomers (of the parent molecule) that are of the same type. Thus, for `molecule_1` of `molecule_group_1`, `monomer_group_1` and `monomer_group_2` represent distinct types of monomers existing within the polymer. Then, below `monomer_group_1`, each monomer within this group is stored. Finally, beneath these individual monomers, only the metadata for that monomer is stored (i.e., no further organization levels). Note however, that metadata can be (and is) stored at each level of the hierarchy, but is left out of the illustration for clarity. Notice also that `molecule_group_2` is not a polymer. Thus, each molecule within this group stores only the corresponding metadata, and no further levels of organization.
<!-- TODO - add image of topology bar in overview page? Here or maybe when the topology is introduced on the connectivity page? -->

## Creating the standard hierarchy from an MDAnalysis universe
We start from the perspective of the [Example - H5MD file](../writing_h5md-nomad.md) page, with identical imports and assuming that an MDAnalysis `universe` is already instantiated from the raw simulation files. As in the previous example, the `universe` containing the topology information is called `universe_topology`.

The following functions will be useful for creating the topology:

```python
def get_composition(children_names):
    '''
    Given a list of children, return a compositional formula as a function of
    these children. The format is <child_1>(n_child_1)<child_2>(n_child_2)...
    '''
    children_count_tup = np.unique(children_names, return_counts=True)
    formula = ''.join([f'{name}({count})' for name, count in zip(*children_count_tup)])
    return formula


def get_molecules_from_bond_list(n_particles: int, bond_list: List[int], particle_types: List[str] = None, particles_typeid=None):
    '''
    Returns a dictionary with molecule info from the list of bonds
    '''

    import networkx

    system_graph = networkx.empty_graph(n_particles)
    system_graph.add_edges_from([(i[0], i[1]) for i in bond_list])
    molecules = [system_graph.subgraph(c).copy() for c in networkx.connected_components(system_graph)]
    mol_dict = []
    for i_mol, mol in enumerate(molecules):
        mol_dict.append({})
        mol_dict[i_mol]['indices'] = np.array(mol.nodes())
        mol_dict[i_mol]['bonds'] = np.array(mol.edges())
        mol_dict[i_mol]['type'] = 'molecule'
        mol_dict[i_mol]['is_molecule'] = True
        if particles_typeid is None and len(particle_types) == n_particles:
            mol_dict[i_mol]['names'] = [particle_types[int(x)] for x in sorted(np.array(mol_dict[i_mol]['indices']))]
        if particle_types is not None and particles_typeid is not None:
            mol_dict[i_mol]['names'] = [particle_types[particles_typeid[int(x)]] for x in sorted(np.array(mol_dict[i_mol]['indices']))]
        mol_dict[i_mol]['formula'] = get_composition(mol_dict[i_mol]['names'])

    return mol_dict


def is_same_molecule(mol_1: dict, mol_2: dict):
    '''
    Checks whether the 2 input molecule dictionaries represent the same
    molecule type, i.e., same particle types and corresponding bond connections.
    '''

    if sorted(mol_1['names']) == sorted(mol_2['names']):
        mol_1_shift = np.min(mol_1['indices'])
        mol_2_shift = np.min(mol_2['indices'])
        mol_1_bonds_shift = mol_1['bonds'] - mol_1_shift
        mol_2_bonds_shift = mol_2['bonds'] - mol_2_shift

        bond_list_1 = [sorted((mol_1['names'][i], mol_1['names'][j])) for i, j in mol_1_bonds_shift]
        bond_list_2 = [sorted((mol_2['names'][i], mol_2['names'][j])) for i, j in mol_2_bonds_shift]

        bond_list_names_1, bond_list_counts_1 = np.unique(bond_list_1, axis=0, return_counts=True)
        bond_list_names_2, bond_list_counts_2 = np.unique(bond_list_2, axis=0, return_counts=True)

        bond_list_dict_1 = {bond[0] + '-' + bond[1]: bond_list_counts_1[i_bond] for i_bond, bond in enumerate(bond_list_names_1)}
        bond_list_dict_2 = {bond[0] + '-' + bond[1]: bond_list_counts_2[i_bond] for i_bond, bond in enumerate(bond_list_names_2)}
        if bond_list_dict_1 == bond_list_dict_2:
            return True

        return False

    return False
```

Then, we can create the topology structure from the MDAnalysis universe:

```python
bond_list = universe_toponly.bonds._bix
molecules = get_molecules_from_bond_list(n_atoms, bond_list, particle_types=universe_toponly.atoms.types, particles_typeid=None)

# create the topology
mol_groups = []
mol_groups.append({})
mol_groups[0]['molecules'] = []
mol_groups[0]['molecules'].append(molecules[0])
mol_groups[0]['type'] = 'molecule_group'
mol_groups[0]['is_molecule'] = False
for mol in molecules[1:]:
    flag_mol_group_exists = False
    for i_mol_group in range(len(mol_groups)):
        if is_same_molecule(mol, mol_groups[i_mol_group]['molecules'][0]):
            mol_groups[i_mol_group]['molecules'].append(mol)
            flag_mol_group_exists = True
            break
    if not flag_mol_group_exists:
        mol_groups.append({})
        mol_groups[-1]['molecules'] = []
        mol_groups[-1]['molecules'].append(mol)
        mol_groups[-1]['type'] = 'molecule_group'
        mol_groups[-1]['is_molecule'] = False


for i_mol_group, mol_group in enumerate(mol_groups):
    mol_groups[i_mol_group]['formula'] = molecule_labels[i_mol_group] + '(' + str(len(mol_group['molecules'])) + ')'
    mol_groups[i_mol_group]['label'] = 'group_' + str(molecule_labels[i_mol_group])
    mol_group_indices = []
    for i_molecule, molecule in enumerate(mol_group['molecules']):
        molecule['label'] = molecule_labels[i_mol_group]
        mol_indices = molecule['indices']
        mol_group_indices.append(mol_indices)
        mol_resids = np.unique(universe_toponly.atoms.resindices[mol_indices])
        if mol_resids.shape[0] == 1:
            continue

        res_dict = []
        for i_resid, resid in enumerate(mol_resids):
            res_dict.append({})
            res_dict[i_resid]['indices'] = np.where( universe_toponly.atoms.resindices[mol_indices] == resid)[0]
            res_dict[i_resid]['label'] = universe_toponly.atoms.resnames[res_dict[i_resid]['indices'][0]]
            res_dict[i_resid]['formula'] = get_composition(universe_toponly.atoms.names[res_dict[i_resid]['indices']])
            res_dict[i_resid]['is_molecule'] = False
            res_dict[i_resid]['type'] = 'monomer'

        res_groups = []
        res_groups.append({})
        res_groups[0]['residues'] = []
        res_groups[0]['residues'].append(res_dict[0])
        res_groups[0]['label'] = 'group_' + res_dict[0]['label']
        res_groups[0]['type'] = 'monomer_group'
        res_groups[0]['is_molecule'] = False
        for res in res_dict[1:]:
            flag_res_group_exists = False
            for i_res_group in range(len(res_groups)):
                if res['label'] == res_groups[i_res_group]['label']:
                    res_groups[i_res_group]['residues'].append(res)
                    flag_res_group_exists = True
                    break
            if not flag_res_group_exists:
                res_groups.append({})
                res_groups[-1]['residues'] = []
                res_groups[-1]['residues'].append(res)
                res_groups[-1]['label'] = 'group_' + res['label']
                res_groups[-1]['formula'] = get_composition(universe_toponly.atoms.names[res['indices']])
                res_groups[-1]['type'] = 'monomer_group'
                res_groups[-1]['is_molecule'] = False

        molecule['formula'] = ''
        for res_group in res_groups:
            res_group['formula'] = res_group['residues'][0]['label'] + '(' + str(len(res_group['residues'])) + ')'
            molecule['formula'] += res_group['formula']
            res_group_indices = []
            for res in res_group['residues']:
                res_group_indices.append(res['indices'])
            res_group['indices'] = np.concatenate(res_group_indices)

        mol_group['indices'] = np.concatenate(mol_group_indices)

        molecule['residue_groups'] = res_groups

```

## Writing the topology to an H5MD-NOMAD file

Here we assume an H5MD-NOMAD file has already been created, as demonstrated on the [Example - H5MD file](../writing_h5md-nomad.md) page, and that the `connectivity` group was created under the root level.

Now, create the `particles_group` group under `connectivity` within our HDF5-NOMAD file:
```python
topology_keys = ['type', 'formula', 'particles_group', 'label', 'is_molecule', 'indices']
custom_keys = ['molecules', 'residue_groups', 'residues']

topology = connectivity.create_group('particles_group')

for i_mol_group, mol_group in enumerate(mol_groups):
    hdf5_mol_group = topology.create_group('group_' + molecule_labels[i_mol_group])
    for mol_group_key in mol_group.keys():
        if mol_group_key not in topology_keys + custom_keys:
            continue
        if mol_group_key != 'molecules':
            hdf5_mol_group[mol_group_key] = mol_group[mol_group_key]
        else:
            hdf5_molecules = hdf5_mol_group.create_group('particles_group')
            for i_molecule, molecule in enumerate(mol_group[mol_group_key]):
                hdf5_mol = hdf5_molecules.create_group('molecule_' + str(i_molecule))
                for mol_key in molecule.keys():
                    if mol_key not in topology_keys + custom_keys:
                        continue
                    if mol_key != 'residue_groups':
                        hdf5_mol[mol_key] = molecule[mol_key]
                    else:
                        hdf5_residue_groups = hdf5_mol.create_group('particles_group')
                        for i_res_group, res_group in enumerate(molecule[mol_key]):
                            hdf5_res_group = hdf5_residue_groups.create_group('residue_group_' + str(i_res_group))
                            for res_group_key in res_group.keys():
                                if res_group_key not in topology_keys + custom_keys:
                                    continue
                                if res_group_key != 'residues':
                                    hdf5_res_group[res_group_key] = res_group[res_group_key]
                                else:
                                    hdf5_residues = hdf5_res_group.create_group('particles_group')
                                    for i_res, res in enumerate(res_group[res_group_key]):
                                        hdf5_res = hdf5_residues.create_group('residue_' + str(i_res))
                                        for res_key in res.keys():
                                            if res_key not in topology_keys:
                                                continue
                                            if res[res_key] is not None:
                                                hdf5_res[res_key] = res[res_key]
```