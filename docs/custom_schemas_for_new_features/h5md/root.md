# Root level

The root level of H5MD-NOMAD structure is organized as follows (identical to the original H5MD specification):

    H5MD-NOMAD root
     \-- h5md
     \-- (particles)
     \-- (observables)
     \-- (connectivity)
     \-- (parameters)

`h5md`
:   A group that contains metadata and information on the H5MD structure
    itself. It is the only mandatory group at the root level of H5MD.

`particles`
:   An optional group that contains information on each particle in the system,
    e.g., a snapshot of the positions or the full trajectory in phase space.

`observables`
:   An optional group that contains other quantities of interest, e.g.,
    physical observables that are derived from the system state at given points
    in time.

`connectivity`
:   An optional group that contains information about the connectivity between particles.

`parameters`
:   An optional group that contains application-specific, custom data such as
    control parameters or simulation scripts.













