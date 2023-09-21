# Specifying units of datasets in H5MD-NOMAD

In the original H5MD schema, units were given as string attributes of datasets, e.g., ``60 m s-2``.
H5MD-NOMAD ammends the treatment of units in 2 ways:

1. If needed, the leading prefactor is stored as a separate attribute of `float` datatype called `unit_factor`.

2. The string that describes the unit should be compatible with the `UnitRegistry` class of the `pint` python module.

Generic representation of unit storage in H5MD-NOMAD:

    <group>
        \-- <dataset>
            +-- (unit: String[])
            +-- (unit_factor: Float)