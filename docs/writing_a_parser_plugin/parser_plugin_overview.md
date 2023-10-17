# How to write a parser

NOMAD uses parsers to convert raw data (for example, output from computational software, instruments,
or electronic lab notebooks) into NOMAD's common Archive format. The following pages describe
how to develop such a parser and integrate it within the NOMAD software. The goal is equip users
with the required knowledge to contribute to and extend NOMAD.


## Getting started

<!-- TODO link to reasons for using NOMAD  -->
In principle, it is possible to [develop a "local parser"](references/quick_parser_setup.md) that uses the *nomad-lab* package to parse raw data,
without changing the NOMAD software itself. This allows a quick start for focusing on the parsing
of the data itself, but is not relevant for full integration of your new parser into NOMAD.
Here we are focused on developing parsers that will be integrated into the NOMAD software.
For this, you will have to [install a development version of NOMAD](references/quick_installing_nomad_dev.md).
<!-- TODO we need to discuss as an Area if this distinction between changing the NOMAD metainfo or not is relevant  -->
<!-- TODO change language to plugin-foced  -->

### Parser organization {#parser-organization}

The NOMAD parsers can be found within your local NOMAD git repo under
`dependencies/parsers/`. The parsers are organized into the following individual projects
(`dependencies/parsers/<parserproject>`) with their own corresponding repositories:

* [atomistic](https://github.com/nomad-coe/atomistic-parsers) - Parsers for output from classical molecular simulations, e.g., from Gromacs, Lammps, etc.
* [database](https://github.com/nomad-coe/database-parsers) - Parsers for various databases, e.g., OpenKim.
* [eelsdb](https://github.com/nomad-coe/nomad-parser-eelsdb) - Parser for the EELS database (https://eelsdb.eu/; to be integrated in the database project).
* [electronic](https://github.com/nomad-coe/electronic-parsers) - Parsers for output from electronic structure calculations, e.g., from Vasp, Fhiaims, etc. <!-- TODO ab Initio instead of electronic structure?  -->
* [nexus](https://github.com/nomad-coe/nomad-parser-nexus) - Parsers for combining various instrument output formats and electronic lab notebooks.
* [workflow](https://github.com/nomad-coe/workflow-parsers) - Parsers for output from task managers and workflow schedulers.

Within each project folder you will find a `test/` directory, containing the [parser tests](parser_tests.md), and also a directory containing the parsers' source code,
`<parserproject>parser` or `<parserproject>parsers`, depending on if one or more
parsers are contained within the project, respectively. In the case of multiple parsers, the files
for individual parsers are contained within a corresponding subdirectory: `<parserproject>parsers/<parsername>`
For example, the Quantum Espresso parser files are found in `dependencies/parsers/electronic/electronicparsers/quantumespresso/`.


### Setting up your development branches

We will first focus on the case of adding a new parser to an existing parser project.
[Creating a new parser project](references/advanced_new_parser_project.md) will require a few extra steps.
<!-- TODO should these steps be list but suggested to skip? JFR - I think not, but we need to make the 2 cases clear...if they are relevant in everyone's view??  -->
The existing parser projects are stored within their own git repositories and then linked
to the NOMAD software. All current parser projects are available at [nomad-coe](https://github.com/nomad-coe)
(see also individual links above).

<!-- TODO create an account first? Link this to another section?  -->
You will first need to create new branches within *both* the NOMAD project and *also* within the corresponding
parser project. Ideally, this should be done following the [best practices for NOMAD development](references/quick_NOMAD_best_practices.md).
Here, we briefly outline the procedure:

Create a new issue within the NOMAD project at [NOMAD gitlab](https://gitlab.mpcdf.mpg.de/nomad-lab/nomad-FAIR.git).
On the page of the new issue, in the top right, click the arrow next to the `Create merge request`
button and select `Create branch`. The branch name should be automatically generated with the
corresponding issue number and the title of the issue (copy the branch name to the clipboard for use below),
and the default source branch should be `develop`.
Click the `Create branch` button.

Now, run the following commands in your local NOMAD directory:

`git fetch --all` &nbsp;&nbsp;&nbsp;&nbsp; (to sync with remote)

`git checkout origin/<new_branch_name> -b <new_branch_name>` &nbsp;&nbsp;&nbsp;&nbsp; (to checkout the new branch and create a local copy of the branch)

Unless you *just* installed the NOMAD development version, you should rerun `./scripts/setup_dev_env.sh`
within the NOMAD directory to reinstall with the newest development branch.

Now we need to repeat this process for the parser project that we plan to extend. As above,
create a new issue at the relevant parser project GitHub page. Using the identical
issue title as you did for the NOMAD project above is ideal for clarity.
On the page of the new issue, in the right sidebar under the subsection `Development`, click
`Create a branch`. As above, the branch name should be automatically generated with the
corresponding issue number and the title of the issue, and the default source branch should be `develop`
(which can be seen by clicking `change source branch`).
Under `What's next`, the default option should be `Checkout locally`, which is what we want in this case.
Click `Create branch`, and then copy the provided commands to the clipboard, and run them within the parser
project folder within your local NOMAD repo, i.e., `dependencies/parsers/<parserproject>`.
<!-- TODO make this whole git section a reference?  -->
