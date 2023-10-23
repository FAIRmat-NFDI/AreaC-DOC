# H5MD-NOMAD: A flexible data-storage schema for uploading molecular simulations to NOMAD

[TOC]

## Notable changes from H5MD to H5MD-NOMAD

In order to effectively parse and normalize the molecular simulation data, the H5MD-NOMAD schema extends the original H5MD framework while also enforces various restrictions to the schema. This section contains a list of such additions and restrictions. Here we distinguish between "unused" features, i.e., metadata that will be ignored by NOMAD and "unsupported" features, i.e., structures that will likely cause an error if used within an H5MD-NOMAD file for upload to NOMAD.

### New or amended features

* [additional standardized particles group elements](explanation-H5MD-NOMAD.md#standardized-h5md-elements-for-particles-group)

* [boundary attribute changed to boolean datatype](explanation-H5MD-NOMAD.md#boundary_anchor)

* [treatment of units](explanation-H5MD-NOMAD.md#units)

### Unused features

* [modules in h5md metadata](explanation-H5MD-NOMAD.md#modules-currently-unused-in-h5md-nomad)

* [arbitrary particle groups not parsed, group labeled `all` required](explanation-H5MD-NOMAD.md#the-particles-group)

* [image, species, and id elements of particles group](explanation-H5MD-NOMAD.md#image_anchor)

* [non-standard elements in particles group](explanation-H5MD-NOMAD.md#non-standard-elements-in-particles-group)

### Unsupported features

* [fixed step and time storage](explanation-H5MD-NOMAD.md#fixed-step-and-time-storage-currently-not-supported-in-h5md-nomad)

* [time-dependent particle lists](explanation-H5MD-NOMAD.md#time-dependence-time-dependent-particle-lists-currently-not-supported-in-h5md-nomad)

* [time-dependent model labels for particles](explanation-H5MD-NOMAD.md#species_label_anchor)

* [only partial support for grouping of observables by particle subgroups](explanation-H5MD-NOMAD.md#obs_para2)

* [time-dependent connectivity elements](explanation-H5MD-NOMAD.md#connectivity_support_anchor)


## Standardized observables in H5MD-NOMAD

### configurational

* `energy quantities`
:

* `radius_of_gyration`
:

### ensemble average
* `radial_distribution_function`
:

### time correlation

* `mean_squared_displacement`
:

