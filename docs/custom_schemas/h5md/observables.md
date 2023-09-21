# The observables group

The initial H5MD proposed a simple and flexible schema for the general storage of observable info, defined roughly as "macroscopic observables" or "averages of a property over many particles", as H5MD elements:

    observables
     \-- <observable1>
     |    \-- step: Integer[N_frames]
     |    \-- time: Float[N_frames]
     |    \-- value: <type>[N_frames]
     \-- <observable2>
     |    \-- step: Integer[N_frames]
     |    \-- time: Float[N_frames]
     |    \-- value: <type>[N_frames][D]
     \-- <group1>
     |    \-- <observable3>
     |         \-- step: Integer[N_frames]
     |         \-- time: Float[N_frames]
     |         \-- value: <type>[N_frames][D][D]
     \-- <observable4>: <type>[]
     \-- ...

<a id="obs_para2"></a>

As depicted above, observables representing only a subset of the particles may be stored in appropriate subgroups similarly to the `particles` tree. H5MD-NOMAD **does** support the organization of observables into subgroups (as discussed in more detail below). However, **grouping by particle groups is not fully supported** in the sense that there is currently no metadata storing the corresponding indices of the relevant particles subgroup. Additionally, since [only the `all` particles group is parsed](particles.md#the-particles-group), information about the named subgroup will not be stored anywhere in the archive. *Thus, we recommend for now that only observables relevant to the `all` particles subgroup are stored within this section.*
<!-- TODO - not sure about this, it might be fine if you can add additional metadata that is stored -->

## H5MD-NOMAD observables

H5MD-NOMAD extends H5MD observable storage by 1. specifying standard observable types with associated metadata and 2. providing standarized specifications for some common observables.
The observable type is provided as an attribute to the particular observable subgroup:

    observables
     \-- <observable_subgroup>
     |    +-- type: String[]
     |    \-- ...
     \-- ...

The following observable types are supported:

<a id="configurational_observable_anchor"></a>

`configurational`
:   An observable that is computed for each individual configuration, with the following general structure:

    observables
     \-- <configurational_subgroup>
     |    +-- type: "configurational"
     |    \-- step: Integer[N_frames]
     |    \-- time: Float[N_frames]
     |    \-- value: <type>[N_frames][M]
     \-- ...
 where `M` is the dimension of the observable. This section may also be used to store per-particle quantities/attributes that are not currently supported as [standardized H5MD-NOMAD elements for particles group](particles.md#standardized-h5md-nomad-elements-for-particles-group), in which case `value` will have dimensions `[N_frames][N_part][M]`.

<a id="ensemble_average_observable_anchor"></a>

`ensemble_average`
:   An observable that is computed by averaging over multiple configurations, with the following generic structure:

    observables
     \-- <ensemble_average_subgroup>
     |    +-- type: "ensemble_average"
     |    \-- (label): String[]
     |    \-- (n_variables): Integer
     |    \-- (variables_name): String[n_variables][]
     |    \-- (n_bins): Integer[]
     |    \-- bins: Float[n_bins][]
     |    \-- value: <type>[n_bins][]
     |    \-- (frame_start): Integer
     |    \-- (frame_end): Integer
     |    \-- (n_smooth): Integer
     |    \-- (type): String[]
     |    \-- (error_type): String[]
     |    \-- (errors): Float[n_bins]
     |    \-- (error_labels): String[]
     |    \-- (frame_end): Integer
     |    \-- (<custom_dataset>): <type>[]
     \-- ...

* `label`
:   describes the particles involved in determining the property. For example, for a radial distribution function between particles of type `A` and `B`, `label` might be set to `A-B`

* `n_variables`
:   dimensionality of the observable. Can also be infered from leading dimension of `bins`.

* `variables_name`
:   name/description of the independent variables along which the observable is defined.

* `n_bins`
:   number of bins along each dimension of the observable. Either single Integer for 1-D observables, or a list of Integers for multi-dimensional observable. Can also be infered from dimensions of `bins`.

* `bins`
:   value of the bins used for calculating the observable along each dimension of the observable.

* `value`
:   value of the calculated ensemble average at each bin.

* `frame_start`
:   trajectory frame index at which the averaging begins. **This index must correspond to the list of steps and times in `particles.all.position`.**

* `frame_end`
:   trajectory frame index at which the averaging ends. **This index must correspond to the list of steps and times in `particles.all.position`.**

* `n_smooth`
:   number of bins over which the running average was computed for `value`.

* `type`
:   Allowed values of `molecular` or `atomic`. Categorizes if the observable is calculated at the molecular or atomic level.
<!-- TODO - not sure if this is useful -->

* `error_type`
:   describes the type of error reported for this observable. Examples: `Pearson correlation coefficient`, `mean squared error`.

* `errors`
:   value of the error at each bin. Can be multidimensional with corresponding label stored in `error_labels`.

* `error_labels`
:   describes the error along individual dimensions for multi-D errors.

* `<custom_dataset>`
:   additional metadata may be given as necessary.
<!-- TODO - Is this really parsed?! -->

<a id="time_correlation_observable_anchor"></a>

`time_correlation`
:   An obervable that is computed by calculating correlations between configurations in time, with the following general structure:

    observables
     \-- <time_correlation_subgroup>
     |    +-- type: "time_correlation"
     |    \-- (label): String[]
     |    \-- (direction): String[]
     |    \-- (n_times): Integer[]
     |    \-- times: Float[n_times][]
     |    \-- value: <type>[n_bins][]
     |    \-- (type): String[]
     |    \-- (error_type): String[]
     |    \-- (errors): Float[n_bins]
     |    \-- (error_labels): String[]
     |    \-- (<custom_dataset>): <type>[]
     \-- ...

* `label`
:   describes the particles involved in determining the property. For example, for a radial distribution function between particles of type `A` and `B`, `label` might be set to `A-B`

* `direction`
:   allowed values of `x`, `y`, `z`, `xy`, `yz`, `xz`, `xyz`. The direction/s used for calculating the correlation function.

* `n_times`
:   number of times windows for the calculation of the correlation function. Can also be infered from dimensions of `times`.

* `times`
:   time values used for calculating the correlation function (i.e., &Delta;t values).

* `value`
:   value of the calculated correlation function at each time.

* `type`
:   Allowed values of `molecular` or `atomic`. Categorizes if the observable is calculated at the molecular or atomic level.
<!-- TODO - not sure if this is useful -->

* `error_type`
:   describes the type of error reported for this observable. Examples: `Pearson correlation coefficient`, `mean squared error`.

* `errors`
:   value of the error at each bin. Can be multidimensional with corresponding label stored in `error_labels`.

* `error_labels`
:   describes the error along individual dimensions for multi-D errors.

* `<custom_dataset>`
:   additional metadata may be given as necessary.
<!-- TODO - Is this really parsed?! -->

A list of standardized observables can be found [HERE](references/standard_observables.md).

