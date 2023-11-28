# The parameters group

The initial H5MD proposed a simple and flexible schema for the storage of general "parameter" information within the `parameters` group, with the following structure:

    parameters
     +-- <user_attribute1>
     \-- <user_data1>
     \-- <user_group1>
     |    \-- <user_data2>
     |    \-- ...
     \-- ...

In contrast, the H5MD-NOMAD schema calls for very specific structures to be used when storing parameter information. While the previous groups have attempted to stay away from enforcing NOMAD-specific data structures on the user, instead opting for more intuitive and generally-convenient structures, the `parameters` group utilizes already-existing metadata and structures within NOMAD to efficiently import simulation parameters in a way that is searchable and comparable to simulations performed by other users.

In this way, the H5MD-NOMAD `parameters` group has the following structure:

    parameters
     \-- <parameter_subgroup_1>
     |    \-- ...
     \-- <parameter_subgroup_2>
     |    \-- ...
     \-- ...

The subgroups `force_calculations` and `workflow` are supported. The following pages describe the detailed data structures for these subgroups, using the NOMAD MetaInfo definitions for each underlying `Quantity`. Please note that:

1. Quantities with `type=MEnum()` are restricted to the provided allowed values.

2. The unit given in the MetaInfo definition does not have to be used within the H5MD-NOMAD file, however, the dimensionality of the unit should match.


## Force calculations

The `force_calculations` group contains the parameters for force calculations according to the force field during a molecular dynamics run.

<a id="force_calculation_template_anchor"></a>

The following json template illustrates the structure of the `force_calculations` group, with example values for clarity:

```json
{
    "vdw_cutoff": {"value": 1.2, "unit": "nm"},
    "coulomb_type": "particle_mesh_ewald",
    "coulomb_cutoff": {"value": 1.2, "unit": "nm"},
    "neighbor_searching": {
        "neighbor_update_frequency": 1,
        "neighbor_update_cutoff": {"value": 1.2, "unit": "nm"}
        }
    }
```

In the following, we provide the NOMAD definitions for each of these quantities:

* `vdw_cutoff`
:

        Quantity(
                type=np.float64,
                shape=[],
                unit='m',
                description='''
                Cutoff for calculating VDW forces.
                ''')

* `coulomb_type`
:

        Quantity(
            type=MEnum('cutoff', 'ewald', 'multilevel_summation', 'particle_mesh_ewald',
                    'particle_particle_particle_mesh', 'reaction_field'),
            shape=[],
            description='''
            Method used for calculating long-ranged Coulomb forces.

            Allowed values are:

            | Barostat Name          | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `""`                   | No thermostat               |

            | `"Cutoff"`          | Simple cutoff scheme. |

            | `"Ewald"` | Standard Ewald summation as described in any solid-state physics text. |

            | `"Multi-Level Summation"` |  D. Hardy, J.E. Stone, and K. Schulten,
            [Parallel. Comput. **35**, 164](https://doi.org/10.1016/j.parco.2008.12.005)|

            | `"Particle-Mesh-Ewald"`        | T. Darden, D. York, and L. Pedersen,
            [J. Chem. Phys. **98**, 10089 (1993)](https://doi.org/10.1063/1.464397) |

            | `"Particle-Particle Particle-Mesh"` | See e.g. Hockney and Eastwood, Computer Simulation Using Particles,
            Adam Hilger, NY (1989). |

            | `"Reaction-Field"` | J.A. Barker and R.O. Watts,
            [Mol. Phys. **26**, 789 (1973)](https://doi.org/10.1080/00268977300102101)|
            ''')


* `coulomb_cutoff`
:

        Quantity(
            type=np.float64,
            shape=[],
            unit='m',
            description='''
            Cutoff for calculating short-ranged Coulomb forces.
            ''')

* `neighbor_searching`
:
Section containing the parameters for neighbor searching/lists during a molecular dynamics run.

* `neighbor_update_frequency`
:

        Quantity(
            type=int,
            shape=[],
            description='''
            Number of timesteps between updating the neighbor list.
            ''')

* `neighbor_update_cutoff`
:

        Quantity(
            type=np.float64,
            shape=[],
            unit='m',
            description='''
            The distance cutoff for determining the neighbor list.
            ''')


## The molecular dynamics workflow

The `workflow` group contains the parameters for any type of workflow. Here we describe the specific case of the well-defined `molecular_dynamics` workflow. Custom workflows are described in detail [HERE](../intro.md).

<a id="md_workflow_template_anchor"></a>

The following json template illustrates the structure of the `molecular_dynamics` subsection of the `workflow` group, with example values for clarity:

```json
{
    "molecular_dynamics": {
        "thermodynamic_ensemble": "NPT",
        "integrator_type": "langevin_leap_frog",
        "integration_timestep": {"value": 2e-15, "unit": "ps"},
        "n_steps": 20000000,
        "coordinate_save_frequency": 10000,
        "velocity_save_frequency": null,
        "force_save_frequency": null,
        "thermodynamics_save_frequency": null,
        "thermostat_parameters": {
            "thermostat_type": "langevin_leap_frog",
            "reference_temperature": {"value": 300.0, "unit": "kelvin"},
            "coupling_constant": {"value": 1.0, "unit": "ps"}},
        "barostat_parameters": {
            "barostat_type": "berendsen",
            "coupling_type": "isotropic",
            "reference_pressure": {"value": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]], "unit": "bar"},
            "coupling_constant": {"value": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]},
            "compressibility": {"value": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]}
            }
    }
}
```

In the following, we provide the NOMAD definitions for each of these quantities:

* `thermodynamic_ensemble`
:

        Quantity(
            type=MEnum('NVE', 'NVT', 'NPT', 'NPH'),
            shape=[],
            description='''
            The type of thermodynamic ensemble that was simulated.

            Allowed values are:

            | Thermodynamic Ensemble          | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `"NVE"`           | Constant number of particles, volume, and energy |

            | `"NVT"`           | Constant number of particles, volume, and temperature |

            | `"NPT"`           | Constant number of particles, pressure, and temperature |

            | `"NPH"`           | Constant number of particles, pressure, and enthalpy |
            ''')

* `integrator_type`
:
        Quantity(
            type=MEnum(
                'brownian', 'conjugant_gradient', 'langevin_goga',
                'langevin_schneider', 'leap_frog', 'rRESPA_multitimescale', 'velocity_verlet'
            ),
            shape=[],
            description='''
            Name of the integrator.

            Allowed values are:

            | Integrator Name          | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `"langevin_goga"`           | N. Goga, A. J. Rzepiela, A. H. de Vries,
            S. J. Marrink, and H. J. C. Berendsen, [J. Chem. Theory Comput. **8**, 3637 (2012)]
            (https://doi.org/10.1021/ct3000876) |

            | `"langevin_schneider"`           | T. Schneider and E. Stoll,
            [Phys. Rev. B **17**, 1302](https://doi.org/10.1103/PhysRevB.17.1302) |

            | `"leap_frog"`          | R.W. Hockney, S.P. Goel, and J. Eastwood,
            [J. Comp. Phys. **14**, 148 (1974)](https://doi.org/10.1016/0021-9991(74)90010-2) |

            | `"velocity_verlet"` | W.C. Swope, H.C. Andersen, P.H. Berens, and K.R. Wilson,
            [J. Chem. Phys. **76**, 637 (1982)](https://doi.org/10.1063/1.442716) |

            | `"rRESPA_multitimescale"` | M. Tuckerman, B. J. Berne, and G. J. Martyna
            [J. Chem. Phys. **97**, 1990 (1992)](https://doi.org/10.1063/1.463137) |
            ''')

* `integration_timestep`
:
        Quantity(
            type=np.float64,
            shape=[],
            unit='s',
            description='''
            The timestep at which the numerical integration is performed.
            ''')

* `n_steps`
:
        Quantity(
            type=int,
            shape=[],
            description='''
            Number of timesteps performed.
            ''')

* `coordinate_save_frequency`
:
        Quantity(
            type=int,
            shape=[],
            description='''
            The number of timesteps between saving the coordinates.
            ''')

* `velocity_save_frequency`
:
        Quantity(
            type=int,
            shape=[],
            description='''
            The number of timesteps between saving the velocities.
            ''')

* `force_save_frequency`
:
        Quantity(
            type=int,
            shape=[],
            description='''
            The number of timesteps between saving the forces.
            ''')

* `thermodynamics_save_frequency`
:
        Quantity(
            type=int,
            shape=[],
            description='''
            The number of timesteps between saving the thermodynamic quantities.
            ''')

* `thermostat_parameters`
:  Section containing the parameters pertaining to the thermostat for a molecular dynamics run.

* `thermostat_type`
:

        Quantity(
            type=MEnum('andersen', 'berendsen', 'brownian', 'langevin_goga', 'langevin_schneider', 'nose_hoover', 'velocity_rescaling',
                    'velocity_rescaling_langevin'),
            shape=[],
            description='''
            The name of the thermostat used for temperature control. If skipped or an empty string is used, it
            means no thermostat was applied.

            Allowed values are:

            | Thermostat Name        | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `""`                   | No thermostat               |

            | `"andersen"`           | H.C. Andersen, [J. Chem. Phys.
            **72**, 2384 (1980)](https://doi.org/10.1063/1.439486) |

            | `"berendsen"`          | H. J. C. Berendsen, J. P. M. Postma,
            W. F. van Gunsteren, A. DiNola, and J. R. Haak, [J. Chem. Phys.
            **81**, 3684 (1984)](https://doi.org/10.1063/1.448118) |

            | `"brownian"`           | Brownian Dynamics |

            | `"langevin_goga"`           | N. Goga, A. J. Rzepiela, A. H. de Vries,
            S. J. Marrink, and H. J. C. Berendsen, [J. Chem. Theory Comput. **8**, 3637 (2012)]
            (https://doi.org/10.1021/ct3000876) |

            | `"langevin_schneider"`           | T. Schneider and E. Stoll,
            [Phys. Rev. B **17**, 1302](https://doi.org/10.1103/PhysRevB.17.1302) |

            | `"nose_hoover"`        | S. Nosé, [Mol. Phys. **52**, 255 (1984)]
            (https://doi.org/10.1080/00268978400101201); W.G. Hoover, [Phys. Rev. A
            **31**, 1695 (1985) |

            | `"velocity_rescaling"` | G. Bussi, D. Donadio, and M. Parrinello,
            [J. Chem. Phys. **126**, 014101 (2007)](https://doi.org/10.1063/1.2408420) |

            | `"velocity_rescaling_langevin"` | G. Bussi and M. Parrinello,
            [Phys. Rev. E **75**, 056707 (2007)](https://doi.org/10.1103/PhysRevE.75.056707) |
            ''')

* `reference_temperature`
:

        Quantity(
            type=np.float64,
            shape=[],
            unit='kelvin',
            description='''
            The target temperature for the simulation.
            ''')

* `coupling_constant`
:

        Quantity(
            type=np.float64,
            shape=[],
            unit='s',
            description='''
            The time constant for temperature coupling. Need to describe what this means for the various
            thermostat options...
            ''')

* `effective_mass`
:

        Quantity(
            type=np.float64,
            shape=[],
            unit='kilogram',
            description='''
            The effective or fictitious mass of the temperature resevoir.
            ''')

* `barostat_parameters`
: Section containing the parameters pertaining to the barostat for a molecular dynamics run.

* `barostat_type`
:

        Quantity(
            type=MEnum('berendsen', 'martyna_tuckerman_tobias_klein', 'nose_hoover', 'parrinello_rahman', 'stochastic_cell_rescaling'),
            shape=[],
            description='''
            The name of the barostat used for temperature control. If skipped or an empty string is used, it
            means no barostat was applied.

            Allowed values are:

            | Barostat Name          | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `""`                   | No thermostat               |

            | `"berendsen"`          | H. J. C. Berendsen, J. P. M. Postma,
            W. F. van Gunsteren, A. DiNola, and J. R. Haak, [J. Chem. Phys.
            **81**, 3684 (1984)](https://doi.org/10.1063/1.448118) |

            | `"martyna_tuckerman_tobias_klein"` | G.J. Martyna, M.E. Tuckerman, D.J. Tobias, and M.L. Klein,
            [Mol. Phys. **87**, 1117 (1996)](https://doi.org/10.1080/00268979600100761);
            M.E. Tuckerman, J. Alejandre, R. López-Rendón, A.L. Jochim, and G.J. Martyna,
            [J. Phys. A. **59**, 5629 (2006)](https://doi.org/10.1088/0305-4470/39/19/S18)|

            | `"nose_hoover"`        | S. Nosé, [Mol. Phys. **52**, 255 (1984)]
            (https://doi.org/10.1080/00268978400101201); W.G. Hoover, [Phys. Rev. A
            **31**, 1695 (1985) |

            | `"parrinello_rahman"`        | M. Parrinello and A. Rahman,
            [J. Appl. Phys. **52**, 7182 (1981)](https://doi.org/10.1063/1.328693);
            S. Nosé and M.L. Klein, [Mol. Phys. **50**, 1055 (1983) |

            | `"stochastic_cell_rescaling"` | M. Bernetti and G. Bussi,
            [J. Chem. Phys. **153**, 114107 (2020)](https://doi.org/10.1063/1.2408420) |
            ''')

* `coupling_type`
:

        Quantity(
            type=MEnum('isotropic', 'semi_isotropic', 'anisotropic'),
            shape=[],
            description='''
            Describes the symmetry of pressure coupling. Specifics can be inferred from the `coupling constant`

            | Type          | Description                               |

            | ---------------------- | ----------------------------------------- |

            | `isotropic`          | Identical coupling in all directions. |

            | `semi_isotropic` | Identical coupling in 2 directions. |

            | `anisotropic`        | General case. |
            ''')

* `reference_pressure`
:

        Quantity(
            type=np.float64,
            shape=[3, 3],
            unit='pascal',
            description='''
            The target pressure for the simulation, stored in a 3x3 matrix, indicating the values for individual directions
            along the diagonal, and coupling between directions on the off-diagonal.
            ''')

* `coupling_constant`
:

        Quantity(
            type=np.float64,
            shape=[3, 3],
            unit='s',
            description='''
            The time constants for pressure coupling, stored in a 3x3 matrix, indicating the values for individual directions
            along the diagonal, and coupling between directions on the off-diagonal. 0 values along the off-diagonal
            indicate no-coupling between these directions.
            ''')

* `compressibility`
:

        Quantity(
            type=np.float64,
            shape=[3, 3],
            unit='1 / pascal',
            description='''
            An estimate of the system's compressibility, used for box rescaling, stored in a 3x3 matrix indicating the values for individual directions
            along the diagonal, and coupling between directions on the off-diagonal. If None, it may indicate that these values
            are incorporated into the coupling_constant, or simply that the software used uses a fixed value that is not available in
            the input/output files.
            ''')


