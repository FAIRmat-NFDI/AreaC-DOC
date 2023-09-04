# Writing an H5MD-NOMAD file

You can write to an HDF5 file via a python interface, using the [h5py](https://docs.h5py.org/en/stable/quick.html) package. This page provides some practical examples to help you get started.

## Imports
```python
import numpy as np
import h5py
import parmed as chem
import MDAnalysis as mda
from pint import UnitRegistry
ureg = UnitRegistry()
```

[h5py](https://docs.h5py.org/en/stable/quick.html)
: module for reading and writing HDF5 files.

[UnitRegistry](https://pint.readthedocs.io/en/0.10.1/tutorial.html)
: object from the [pint](https://pint.readthedocs.io/en/stable/) package that provides assistance for working with units. We suggest using this package for easiest compatability with NOMAD.

[MDAnalysis](https://www.mdanalysis.org/)
: a library to analyze trajectories from molecular dynamics simulations stored in various formats.

[ParmEd](https://parmed.github.io/ParmEd/html/index.html)
: a tool for aiding in investigations of biomolecular systems using popular molecular simulation packages.

## Example Data

In the following we consider a fictitious set of "vanilla" molecular dynamics simulations, run with the OpenMM software. The following definitions set the dimensionality, periodicity, and the units for this simulation.

```python
dimension = 3
periodicity = [True, True, True]

time_unit = 1.0 * ureg.picosecond
length_unit = 1.0 * ureg.angstrom
energy_unit = 1000. * ureg.joule
mass_unit = 1.0 * ureg.amu
charge_unit = 1.0 * ureg.e
temperature_unit = 1.0 * ureg.K
custom_unit = 1.0 * ureg.newton / length_unit**2
acceleration_unit = 1.0 * length_unit / time_unit**2
```

In this example, we will assume that the relevant simulation data is compatible with [MDAnalysis](https://www.mdanalysis.org/), such that a `universe` containing the trajectory and topology information can be created. Note: Knowledge of the MDAnalysis package is not necessary for understanding this example. The dimensions of the supplied quantities will be made clear in each case.

Create a universe by supplying a `pdb` structure file and corresponding `dcd` trajectory file ([MDAnalysis supports many different file formats](https://userguide.mdanalysis.org/stable/formats/index.html)):
```python
universe = mda.Universe('initial_structure.pdb', 'trajectory.dcd') # use the input coordinate file for positions

n_frames = len(universe.trajectory)
n_atoms = universe.trajectory[0].n_atoms
```
Some topologies can be loaded directly into MDAnalysis. However, for simulations from OpenMM, one can read the topology using `parmed` and then import it to MDanalysis:
```python
pdb = app.PDBFile('initial_structure.pdb')
forcefield = app.ForceField('force_field.xml')
system = forcefield.createSystem(pdb.topology)
struct = chem.openmm.load_topology(pdb.topology, system)
universe_toponly = mda.Universe(struct)
```

## H5MD Group

Create an hdf5 file called `test_h5md-nomad.h5` and create the group `h5md` under `root`:
```python
h5_write = h5py.File('test_h5md-nomad.h5', 'w')
h5md = h5_write.create_group('h5md')
```

Add the h5md version (1.0.x in this case) as an attribute of the `h5md` group:
```python
h5md.attrs['version'] = [1,0]
```

Create the `author` group and add the associated metadata:
```python
author = h5md.create_group('author')
author.attrs['name'] = 'author name'
author.attrs['email'] = 'author-name@example-domain.edu'
```

Create the `program` group and add the associated metadata:
```python
program = h5md.create_group('program')
program.attrs['name'] = 'OpenMM'
program.attrs['version'] = '7.7.0'
```

Create the `creator` group and add the associated metadata:
```python
program = h5md.create_group('creator')
program.attrs['name'] = h5py.__name__
program.attrs['version'] = str(h5py.__version__)
```

## Particles Group

Create the `particles` group and the underlying `all` group to hold the relevant particles data:
```python
particles = h5_write.create_group('particles')
particles_group_all = particles.create_group('all')
```

Get the steps, times, positions, and lattice vectors (i.e., box dimensions) from the MDA universe:
```python
# quantities extracted from MDAnalysis
steps = []
times = []
positions = []
lattice_vectors = []
for i_frame, frame in enumerate(universe.trajectory):
    times.append(frame.time)
    steps.append(frame.frame)
    positions.append(frame.positions)
    lattice_vectors.append(frame.triclinic_dimensions)
```

Set the positions and corresponding metadata:
```python
position_group_all = particles_group_all.create_group('position')
position_group_all['step'] = steps  # shape = (n_frames)
position_group_all['time'] = times  # shape = (n_frames)
position_group_all['time'].attrs['unit'] = str(time_unit.units)
position_group_all['time'].attrs['unit_factor'] = time_unit.magnitude
position_group_all['value'] = positions  # shape = (n_frames, n_atoms, dimension)
position_group_all['value'].attrs['unit'] = str(length_unit.units)
position_group_all['value'].attrs['unit_factor'] = length_unit.magnitude
```

Set the particle-specific metadata:
```python
particles_group_all['species_label'] = universe_toponly.atoms.types  # shape = (n_atoms)
particles_group_all['force_field_label'] = universe_toponly.atoms.names  # shape = (n_atoms)
particles_group_all['mass'] = universe_toponly.atoms.masses  # shape = (n_atoms)
particles_group_all['mass'].attrs['unit'] = str(mass_unit.units)
particles_group_all['mass'].attrs['unit_factor'] = mass_unit.magnitude
particles_group_all['charge'] = universe_toponly.atoms.charges  # shape = (n_atoms)
particles_group_all['charge'].attrs['unit'] = str(charge_unit.units)
particles_group_all['charge'].attrs['unit_factor'] = charge_unit.magnitude
```
<!-- TODO - Should I say something about the species label here? Original code was:  [re.sub('[1-9]', '', atom_type) for atom_type in universe_toponly.atoms.types] -->

Create the `box` group under `particles.all` and write corresponding data:
```python
box_group = particles_group_all.create_group('box')
box_group.attrs['dimension'] = dimension
box_group.attrs['boundary'] = periodicity
edges = box_group.create_group('edges')
edges['step'] = steps
edges['time'] = times
edges['time'].attrs['unit'] = str(time_unit.units)
edges['time'].attrs['unit_factor'] = time_unit.magnitude
edges['value'] = lattice_vectors
edges['value'].attrs['unit'] = str(length_unit.units)
edges['value'].attrs['unit_factor'] = length_unit.magnitude

```

## Connectivity Group

Create the `connectivity` group under `root` and add the tuples of bonds, angles, and dihedrals:
```python
connectivity = h5_write.create_group('connectivity')
connectivity['bonds'] = universe_toponly.bonds._bix  # shape = (n_bonds, 2)
connectivity['angles'] = universe_toponly.angles._bix  # shape = (n_angles, 3)
connectivity['dihedrals'] = universe_toponly.dihedrals._bix  # shape = (n_dihedrals, 4)
connectivity['impropers'] = universe_toponly.impropers._bix  # shape = (n_impropers, 4)
```

The creation of the `particles_group` group is discussed [HERE](references/creating_a_topology.md)


## Observables Group

For this section, we will consider sets of fabricated observable data. First, create the `obervables` group under root:
```python
observables = h5_write.create_group('observables')
```

There are 3 types of support observables:
```python
types = ['configurational', 'ensemble_average', 'correlation_function']
```

### Configurational Observables

Fabricated data:
```python
temperatures = 300. * np.ones(n_frames)
potential_energies = 1.0 * np.ones(n_frames)
kinetic_energies = 2.0 * np.ones(n_frames)
```

Create a `temperature` group and populate the associated metadata:

```python
temperature = observables.create_group('temperature')
temperature.attrs['type'] = types[0]
temperature['step'] = steps
temperature['time'] = times
temperature['time'].attrs['unit'] = str(time_unit.units)
temperature['time'].attrs['unit_factor'] = time_unit.magnitude
temperature['value'] = temperatures
temperature['value'].attrs['unit'] = str(temperature_unit.units)
temperature['value'].attrs['unit_factor'] = temperature_unit.magnitude
```

Create an `energy` group to hold various types of energies. Add :
```python
energies = observables.create_group('energy')

potential_energy = energies.create_group('potential')
potential_energy.attrs['type'] = types[0]
potential_energy['step'] = steps
potential_energy['time'] = times
potential_energy['time'].attrs['unit'] = str(time_unit.units)
potential_energy['time'].attrs['unit_factor'] = time_unit.magnitude
potential_energy['value'] = potential_energies
potential_energy['value'].attrs['unit'] = str(energy_unit.units)
potential_energy['value'].attrs['unit_factor'] = energy_unit.magnitude

kinetic_energy = energies.create_group('kinetic')
kinetic_energy.attrs['type'] = types[0]
kinetic_energy['step'] = steps
kinetic_energy['time'] = times
kinetic_energy['time'].attrs['unit'] = str(time_unit.units)
kinetic_energy['time'].attrs['unit_factor'] = time_unit.magnitude
kinetic_energy['value'] = kinetic_energies
kinetic_energy['value'].attrs['unit'] = str(energy_unit.units)
kinetic_energy['value'].attrs['unit_factor'] = energy_unit.magnitude
```
### Ensemble Average Observables

Fabricated data:
```python
rdf = np.loadtxt('rdf_SOL-SOL.xvg', comments=['@', '#'])
rdfs = {
    'MOL1-MOL1': {
        'n_bins': len(rdf[:, 0]),
        'bins': rdf[:, 0],
        'value': rdf[:, 1],
        'type': 'molecular',
        'frame_start': 0,
        'frame_end': n_frames-1
    },
    'MOL1-MOL2': {
        'n_bins': len(rdf[:, 0]),
        'bins': rdf[:, 0],
        'value': rdf[:, 1],
        'type': 'molecular',
        'frame_start': 0,
        'frame_end': n_frames-1
    },
    'MOL2-MOL2': {
        'n_bins': len(rdf[:, 0]),
        'bins': rdf[:, 0],
        'value': rdf[:, 1],
        'type': 'molecular',
        'frame_start': 0,
        'frame_end': n_frames-1
    }
}

Ds = {
    'MOL1': {
        'value': 1.0,
        'error_type': 'Pearson_correlation_coefficient',
        'errors': 0.98
    },
    'MOL2': {
        'value': 2.0,
        'error_type': 'Pearson_correlation_coefficient',
        'errors': 0.95
    }
}
```

### Time Correlation Observables

Fabricated data:
```python
msd = np.loadtxt('msd_SOL.xvg', comments=['@', '#'])
msds = {
    'MOL1': {
        'n_times': len(msd[:, 0]),
        'times': msd[:, 0],
        'value': msd[:, 1],
        'type': 'molecular',
        'direction': 'xyz',
        'error_type': 'standard_deviation',
        'errors': np.zeros(len(msd[:, 0])),
    },
    'MOL2': {
        'n_times': len(msd[:, 0]),
        'times': msd[:, 0],
        'value': msd[:, 1],
        'type': 'molecular',
        'direction': 'xyz',
        'error_type': 'standard_deviation',
        'errors': np.zeros(len(msd[:, 0])),
    }
}
```





```python
radial_distribution_functions = observables.create_group('radial_distribution_functions')
for key in rdfs.keys():
    rdf = radial_distribution_functions.create_group(key)
    rdf.attrs['type'] = types[1]
    rdf['type'] = rdfs[key]['type']
    rdf['n_bins'] = rdfs[key]['n_bins']
    rdf['bins'] = rdfs[key]['bins']
    rdf['bins'].attrs['unit'] = str(length_unit.units)
    rdf['bins'].attrs['unit_factor'] = length_unit.magnitude
    rdf['value'] = rdfs[key]['value']
    rdf['frame_start'] = rdfs[key]['frame_start']
    rdf['frame_end'] = rdfs[key]['frame_end']

mean_squared_displacements = observables.create_group('mean_squared_displacements')
msd_unit = length_unit * length_unit
diff_unit = msd_unit / time_unit
for key in msds.keys():
    msd = mean_squared_displacements.create_group(key)
    msd.attrs['type'] = types[2]
    msd['type'] = msds[key]['type']
    msd['direction'] = msds[key]['direction']
    msd['error_type'] = msds[key]['error_type']
    msd['n_times'] = msds[key]['n_times']
    msd['times'] = msds[key]['times']
    msd['times'].attrs['unit'] = str(time_unit.units)
    msd['times'].attrs['unit_factor'] = time_unit.magnitude
    msd['value'] = msds[key]['value']
    msd['value'].attrs['unit'] = str(msd_unit.units)
    msd['value'].attrs['unit_factor'] = msd_unit.magnitude
    msd['errors'] = msds[key]['errors']

diffusion_constants = observables.create_group('diffusion_constants')
for key in Ds.keys():
    diffusion_constant = diffusion_constants.create_group(key)
    diffusion_constant.attrs['type'] = types[1]
    diffusion_constant['value'] = Ds[key]['value']
    diffusion_constant['value'].attrs['unit'] = str(diff_unit.units)
    diffusion_constant['value'].attrs['unit_factor'] = diff_unit.magnitude
    diffusion_constant['error_type'] = Ds[key]['error_type']
    diffusion_constant['errors'] = Ds[key]['errors']
```

## Parameter Group
```python
def get_parameters_recursive(parameter_group, parameter_dict):
    # Store the parameters from parameter dict into an hdf5 file
    for key, val in parameter_dict.items():
        if type(val) == dict:
            param = val.get('value')
            if param is not None:
                parameter_group[key] = param
                unit = val.get('unit')
                if unit is not None:
                    parameter_group[key].attrs['unit'] = unit
            else:  # This is a subsection
                subsection = parameter_group.create_group(key)
                subsection = get_parameters_recursive(subsection, val)
        else:
            if val is not None:
                parameter_group[key] = val

    return parameter_group

parameters = h5_write.create_group('parameters')
force_calculations = parameters.create_group('force_calculations')
force_calculations = get_parameters_recursive(force_calculations, force_calculation_parameters)
workflow = parameters.create_group('workflow')
workflow = get_parameters_recursive(workflow, workflow_parameters)
```

