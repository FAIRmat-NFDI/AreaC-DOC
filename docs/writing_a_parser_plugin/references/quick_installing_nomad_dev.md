# Quick start to installing a development version of NOMAD

Detailed instructions can be found here: [Developing NOMAD](https://nomad-lab.eu/prod/rae/docs/developers.html).

The NOMAD repository is located on the MPCDF gitlab. To collaborate on the project, you will first
need an invitation. You can send invitation requests to `fairmat@physik.hu-berlin.de`.

Once you have access to MPCDF gitlab:

Clone the NOMAD gitlab repo and navigate to the resulting directory:

    git clone https://gitlab.mpcdf.mpg.de/nomad-lab/nomad-FAIR.git nomad
    cd nomad/

You should be on the branch `origin/develop` by default.
Create a virtual environment for your nomad installation:

    pip install virtualenv
    virtualenv -p `which python3` .pyenv
    source .pyenv/bin/activate

Now install nomad:

    ./scripts/setup_dev_env.sh