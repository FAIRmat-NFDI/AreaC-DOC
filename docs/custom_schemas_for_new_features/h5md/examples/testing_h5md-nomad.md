# Example - Accessing the H5MD-NOMAD file


The following functions are useful for accessing data from your H5MD-NOMAD file:
```python
def apply_unit(quantity, unit, unit_factor):
    from pint import UnitRegistry
    ureg = UnitRegistry()

    if quantity is None:
        return
    if unit:
        unit = ureg(unit)
        unit *= unit_factor
        quantity *= unit

    return quantity

def decode_hdf5_bytes(dataset):
    if dataset is None:
        return
    elif type(dataset).__name__ == 'ndarray':
        if dataset == []:
            return dataset
        dataset = np.array([val.decode("utf-8") for val in dataset]) if type(dataset[0]) == bytes else dataset
    else:
        dataset = dataset.decode("utf-8") if type(dataset) == bytes else dataset
    return dataset

def hdf5_attr_getter(source, path, attribute, default=None):
    '''
    Extracts attribute from object based on path, and returns default if not defined.
    '''
    section_segments = path.split('.')
    for section in section_segments:
        try:
            value = source.get(section)
            source = value[-1] if isinstance(value, list) else value
        except Exception:
            return
    value = source.attrs.get(attribute)
    source = value[-1] if isinstance(value, list) else value
    source = decode_hdf5_bytes(source) if source is not None else default
    return source

def hdf5_getter(source, path, default=None):
    '''
    Extracts attribute from object based on path, and returns default if not defined.
    '''
    section_segments = path.split('.')
    for section in section_segments:
        try:
            value = source.get(section)
            unit = hdf5_attr_getter(source, section, 'unit')
            unit_factor = hdf5_attr_getter(source, section, 'unit_factor', default=1.0)
            source = value[-1] if isinstance(value, list) else value
        except Exception:
            return

    if source is None:
        source = default
    elif type(source) == h5py.Dataset:
        source = source[()]
        source = apply_unit(source, unit, unit_factor)

    return decode_hdf5_bytes(source)
```

Open your H5MD-NOMAD file with `h5py`:
```python
import h5py

h5_read = h5py.File('test_h5md-nomad.h5', 'r')
```

Access a particular data set:
```python
potential_energies = h5_read['observables']['energy']['potential']['value']
print(potential_energies[()])
```
result:
```
array([1., 1., 1., 1., 1.])
```

Get the unit information for this quantity:
```python
unit = potential_energies.attrs['unit']
unit_factor = potential_energies.attrs['unit_factor']

print(unit)
print(unit_factor)
```

results:
```
joule
1000.0
```

Alternatively, the above functions will return the dataset as python arrays, i.e., already applying `[()]` to the HDF5 element, and also apply the appropriate units where applicable:
```python
potential_energies = hdf5_getter(h5_read, 'observables.energy.potential.value')
print(potential_energies)
```

result:
```
Magnitude
[1000.0 1000.0 1000.0 1000.0 1000.0]
Units	joule
```