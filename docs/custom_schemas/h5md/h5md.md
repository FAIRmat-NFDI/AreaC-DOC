# The H5MD Group

A set of global metadata describing the H5MD structure is stored in the `h5md`
group as attributes. The contents of the group is:

    h5md
     +-- version: Integer[2]
     \-- author
     |    +-- name: String[]
     |    +-- (email: String[])
     \-- creator
     |    +-- name: String[]
     |    +-- version: String[]
     \-- program
          +-- name: String[]
          +-- version: String[]

`version`
:   An attribute, of `Integer` datatype and of simple dataspace of rank 1 and
    size 2, that contains the major version number and the minor version number
    of the H5MD specification the H5MD structure conforms to.

The version *x.y.z* of the H5MD specification follows
[semantic versioning](https://semver.org/spec/v2.0.0.html): A change of the major
version number *x* indicates backwards-incompatible changes to the file
structure. A change of the minor version number *y* indicates
backwards-compatible changes to the file structure. A change of the patch
version number *z* indicates changes that have no effect on the file
structure and serves to allow for clarifications or minor text editing of
the specification.

As the *z* component has no impact on the content of a H5MD file, the
`version` attribute contains only *x* and *y*.

`author`
:   A group that contains metadata on the person responsible for the simulation
    (or the experiment) as follows:

* `name`
:   An attribute, of fixed-length string datatype and of scalar
    dataspace, that holds the author's real name.

* `email`
:   An optional attribute, of fixed-length string datatype and
    of scalar dataspace, that holds the author's email address of
    the form `email@domain.tld`.

`creator`
:   A group that contains metadata on the program that created the H5MD
    structure as follows:

* `name`
:   An attribute, of fixed-length string datatype and of scalar
    dataspace, that stores the name of the program.

* `version`
:   An attribute, of fixed-length string datatype and of scalar
    dataspace, that yields the version of the program.

`program`
:   A group that contains metadata on the code/package that created the simulation data contained within this H5MD structure:

* `name`
:   An attribute, of fixed-length string datatype and of scalar
    dataspace, that stores the name of the program.

* `version`
:   An attribute, of fixed-length string datatype and of scalar
    dataspace, that yields the version of the program.


### Modules **(currently unused in H5MD-NOMAD)**

The original H5MD specification allowed the definition of modules under the h5md group.
Such modules are currently ignored when uploading to NOMAD, although they of course will
remain present in the raw uploaded hdf5 file.

<!-- The H5MD specification can be complemented by modules specific to a
domain of research.  A module may define additional data elements within the
H5MD structure, add conditions that the data must satisfy, or define rules for
their semantic interpretation. Multiple modules may be present, as long as
their prescriptions are not contradictory. Each module is identified by a name
and a version number.

The modules that apply to a specific H5MD structure are stored as subgroups
within the group `h5md/modules`. Each module holds its version number as an
attribute, further module-specific information may be stored:

    h5md
     \-- (modules)
          \-- <module1>
          |    +-- version: Integer[2]
          \-- <module2>
          |    +-- version: Integer[2]
          \-- ...

`version`
:   An attribute, of `Integer` datatype and of simple dataspace of rank 1 and
    size 2, that contains the major version number and the minor version number
    of the module.

    The version *x.y.z* of an H5MD module follows [semantic versioning][semver]
    [@semantic_versioning] and again only the components *x* and *y* are
    stored, see `h5md/version` in "[H5MD metadata]."

[semver]: http://semver.org/spec/v2.0.0.html -->