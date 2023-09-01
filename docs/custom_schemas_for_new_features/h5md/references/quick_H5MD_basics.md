# Quick Start - H5MD basics

The following was duplicated or summarized from the [H5MD webpage](http://h5md.nongnu.org/).

## File format

H5MD structures are stored in the
[HDF5 file format](http://www.hdfgroup.org/HDF5/doc/H5.format.html) version 0
or later. It is recommended to use the HDF5 file format version 2, which
includes the implicit tracking of the creation and modification times of the
file and of each of its objects.

## Notation and naming

HDF5 files are organized into groups and datasets, summarized as *objects*,
which form a tree structure with the datasets as leaves. Attributes can be
attached to each object. The H5MD specification adopts this naming and uses the
following notation to depict the tree or its subtrees:

`\-- item`
:   An object within a group, that is either a dataset or a group. If it is a
    group itself, the objects within the group are indented by five spaces with
    respect to the group name.

`+-- attribute`
:   An attribute, that relates either to a group or a dataset.

`\-- data: <type>[dim1][dim2]`
:   A dataset with array dimensions `dim1` by `dim2` and of type `<type>`. The
    type is taken from `Enumeration`, `Integer`, `Float` or `String` and follows
    the HDF5 Datatype classes. If the type is not mandated by H5MD, `<type>` is
    indicated. A scalar dataspace is indicated by `[]`.

`(identifier)`
:   An optional item.

`<identifier>`
:   An optional item with unspecified name.

H5MD defines a structure called *H5MD element* (or *element* whenever there
is no confusion). An element is either a time-dependent group or a single
dataset (see time-dependent data below), depending on the situation.

<!-- ## General organization

H5MD defines an organization of the HDF5 file or a part thereof into groups,
datasets, and attributes. The root level of the H5MD structure may coincide
with the root of the HDF5 file or be an arbitrary group inside the HDF5 tree. A
number of groups are defined at the H5MD root level. Several levels of
subgroups may exist inside the H5MD structure, allowing the storage and
description of subsystems.

The H5MD structure is allowed to possess non-specified groups, datasets, or
attributes that contain additional information such as application-specific
parameters or data structures, leaving scope for future extensions. Only the
`h5md` group is mandatory at the H5MD root level. All other root groups are
optional, allowing the user to store only relevant data. Inside each group,
every group or dataset is again optional, unless specified differently.

H5MD supports equally the storage of time-dependent and time-independent data,
i.e., data that change in the course of the simulation or that do not. The
choice between those storage types is not made explicit for the elements in the
specification, it has to be made according to the situation. For instance, the
species and mass of the particles are often fixed in time, but in chemically
reactive systems this might not be appropriate. -->

## Time-dependent data

Time-dependent data consist of a series of samples (or frames) referring to
multiple time steps. Such data are found inside a single dataset and are
accessed via dataset slicing. In order to link the samples to the time axis of
the simulation, H5MD defines a *time-dependent H5MD element* as a group that
contains, in addition to the actual data, information on the corresponding
integer time step and on the physical time. The structure of such a group is:

    <element>
     \-- step
     \-- (time)
     \-- value: <type>[variable][...]

`value`
:   A dataset that holds the data of the time series. It uses a simple
    dataspace whose rank is given by 1 plus the tensor rank of the data stored.
    Its shape is the shape of a single data item prepended by a `[variable]`
    dimension that allows the accumulation of samples during the course of
    time. For instance, the data shape of scalars has the form `[variable]`,
    `D`-dimensional vectors use `[variable][D]`, etc. The first dimension of
    `value` must match the unique dimension of `step` and `time`.

If several H5MD elements are sampled at equal times, `step` and `time` of one
element may be hard links to the `step` and `time` datasets of a different
element. If two elements are sampled at different times (for instance, if one
needs the positions more frequently than the velocities), `step` and `time` are
unique to each of them.

The storage of step and time information follows one of the two modes below,
depending on the dataset layout of `step`.

### Explicit step and time storage

    <element>
     \-- step: Integer[variable]
     \-- (time: type[variable])
     \-- value: <type>[variable][...]

`step`
:   A dataset with dimensions `[variable]` that contains the time steps at
    which the corresponding data were sampled. It is of `Integer` type to allow
    exact temporal matching of data from one H5MD element to another. The
    values of the dataset are in monotonically increasing order.

`time`
:   An optional dataset that is the same as the `step` dataset, except it is
    `Float` or `Integer`-valued and contains the simulation time in physical units. The
    values of the dataset are in monotonically increasing order.

### Fixed step and time storage **(currently not supported in H5MD-NOMAD)**

    <element>
     \-- step: Integer[]
	     +-- (offset: type[])
     \-- (time: type[])
	     +-- (offset: type[])
     \-- value: <type>[variable][...]

`step`
:   A scalar dataset of `Integer` type that contains the increment of the
    time step between two successive rows of data in `value`.

    `offset`
	: A scalar attribute of type `Integer` corresponding to the first sampled
    value of `step`.

`time`
:   An optional scalar dataset that is the same as the `step` dataset, except that
    it is `Float` or `Integer`-valued and contains the increment in simulation
    time, in physical units.

`offset`
	: A scalar attribute of the same type as `time` corresponding to the first
    sampled value of `time`.

For this storage mode, the explicit value $s(i)$ of the step corresponding to
the $i$-th row of the dataset `value` is $s(i) = i\times\mathrm{step} +
\mathrm{offset}$ where $\mathrm{offset}$ is set to zero if absent.
The corresponding formula for the time $t(i)$ is identical: $t(i) =
i\times\mathrm{time} + \mathrm{offset}$.
The index $i$ is zero-based.

## Time-independent data

H5MD defines a *time-independent H5MD element* as a dataset. As for the
`value` dataset in the case of time-dependent data, data type and array shape
are implied by the stored data, where the `[variable]` dimension is omitted.

## Storage order of arrays

All arrays are stored in C-order as enforced by the HDF5 file format.
A C or C++ program may thus declare `r[N][D]` for the array
of particle coordinates while the Fortran program will declare a `r(D,N)` array
(appropriate index ordering for a system of `N` particles in `D` spatial
dimensions), and the HDF5 file will be the same.

## Storage of particles and tuples lists

### Storage of a list of particles

A list of particles is an H5MD element:

    <list_name>: Integer[N]
     +-- particles_group: Object reference

where `list_name` is a dataset of `Integer` type and dimensions `[N]`, N being
the number of particle indices stored in the list. `particles_group` is an
attribute containing an HDF5 Object Reference as defined by the HDF5 file format. `particles_group`
must refer to one of the groups in `/particles`.

If a *fill value* is defined for `list_name`, the particles indices in
`list_name` set to this value are ignored.

If the corresponding `particles_group` does not possess the `id` element, the
values in `list_name` correspond to the indexing of the elements in
`particles_group`. Else, the values in `list_name` must be put in correspondence
with the equal values in the `id` element.

### Storage of tuples

A list of tuples is an H5MD element:

    <tuples_list_name>: Integer[N,T]
     +-- particles_group: Object reference

where `N` is the length of the list and `T` is the size of the tuples.  Both `N`
and `T` may indicate variable dimensions. `particles_group` is an attribute
containing an HDF5 Object Reference, obeying the same rules as for the lists of
particles.

The interpretation of the values stored within the tuples is done as for a list
of particles.

If a *fill value* is defined, tuples with at least one entry set to this
value are ignored.

### Time-dependence **(time-dependent particle lists currently not supported in H5MD-NOMAD)**

As the lists of particles and tuples above are H5MD elements, they can be stored
either as time-dependent groups or time-independent datasets.

As an example, a time-dependent list of pairs is stored as:

    <pair_list_name>
       +-- particles_group: Object reference
       \-- value: Integer[variable,N,2]
       \-- step: Integer[variable]

The dimension denoted by `N` may be variable.

