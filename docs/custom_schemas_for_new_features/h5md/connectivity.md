# The connectivity group

The initial H5MD proposed a simple and flexible schema for the storage of "connectivity" information, e.g., to be used in conjunction with a molecular mechanics force field.
The connectivity information is stored as tuples in the group
`/connectivity`. The tuples are pairs, triples, etc. as needed and may be either
time-independent or time-dependent.
As with other elements, connectivity elements can be defined for particular particle groups. However, H5MD-NOMAD focuses on the storage of connectivity elements for the entire system (i.e., the `all` particles group).

## Standardized H5MD-NOMAD connectivity

The general structure of the `connectivity` group is as follows:

    connectivity
     \-- (bonds): Integer[N_part][2]
     \-- (angles): Integer[N_part][3]
     \-- (dihedrals): Integer[N_part][4]
     \-- (impropers): Integer[N_part][4]
     \-- (<custom_interaction>): Integer[N_part][m]
     \-- (particles_group)
          \-- ...

`N_part` corresponds to the number of particles stored in the `particles/all` group.

* `bonds`
: a list of 2-tuples specifying the indices of particles containing a "bond interaction".

* `angles`
: a list of 3-tuples specifying the indices of particles containing an "angle interaction".

* `dihedrals`
: a list of 4-tuples specifying the indices of particles containing a "dihedral interaction".

* `impropers`
: a list of 4-tuples specifying the indices of particles containing an "improper dihedral interaction".

* `<custom_interaction>`
: a list of m-tuples specifying the indices of particles containing an arbitrary interaction. `m` denotes the number of particles involved in the interaction.

* `particles_group`
: See below.

<a id="connectivity_support_anchor"></a>
**Currently only time-independent connectivity elements are supported.**

## The particles_group subgroup

Despite not fully utilizing the organization of arbitrary groups of particles within the `particles` group, H5MD-NOMAD allows for the user to provide an arbitrary hierarchy of particle groupings, also refered to as a "topology", within the `connectivity` subgroup called `particles_group`. This information will be used by NOMAD to facilitate visualizations of the system, through the "topology bar" in the overview page. The general structure of the topology group is as follows:

    connectivity
     \-- particles_group
          \-- <group_1>
          |    \-- (type): String[]
          |    \-- (formula): String[]
          |    \-- indices: Integer[]
          |    \-- (is_molecule): Bool
     |    |    \-- (<custom_dataset>): <type>[]
          |    \-- (particles_group):
          |        \-- ...
          \-- <group_2>
              \-- ...

The initial `particles_group` subgroup, directly under `connectivity`, is a container for the entire topology. `particles_group` contains a series of subgroups with arbitrary names, which denote the first level of organization within the topology. The name of each subgroup will become the group label within the NOMAD metadata. Each of these subgroups then contain a series of datasets:

* `type`
: describes the type of particle group. There exist a list of standardized types: `molecule_group`, `molecule`, `monomer_group`, `monomer`. However, arbitrary types can be given. We suggest that you 1. use the standardized types when appropriate (note that protein residues should be generically typed as `monomer`) and 2. use the general format `<type>_group` for groups of a distinct type (see further description of suggested hierarchy below).

* `formula`
: a "chemical-like" formula that describes the particle group with respect to its underlying components. The format for the formula is `<child_1>(n_child_1)<child_2>(n_child_2)...`, where `<child_x>` is the name/label of the underlying component, and `n_child_x` is the number of such components found within this particle group. Example: A particles group containing 100 water molecules named `water` has the formula `water(100)`, whereas each underlying water molecule has the standard chemical formula `H2O`.

* `indices`
: a list of integer indices corresponding to all particles belonging to this group. Indices should correspond to the list of particles stored in the `particles/all` group.

* `is_molecule`
: indicator of individual molecules (typically with respect to the bond connections defined by a force field).

* `custom_dataset`
: arbitrary additional metadata for this particle group may be given.


Each subgroup may also contain a (nested) `particles_group` subgroup, in order to subdivide the group of particles into a organizational hierarchy. As with the overall `particles_group` container, the groups contained within `particles_group` must not *partition* the particles within this group (i.e., overlapping or non-complete grouping are allowed). However, particle groups *must* contain particles already contained within the parent `particles_group` (i.e., subgroups must be a subset of the grouping at the previous level of the hierarchy).

Note that typically the `particles_group` hierarchy ends at the level of individual particles (i.e., individual particles are not stored, since this information is already contained within the `particles` group).