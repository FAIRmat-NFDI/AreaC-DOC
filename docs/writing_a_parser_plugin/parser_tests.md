# Creating parser tests

Each parser should have a series of associated (py)tests to ensure that future developments do
not affect the intended parsing. These tests can be found under directly under  `<parserproject>/tests/`
directory, labeled by the corresponding parser name: `test_parsername.py`.

Here is an example template of such a `pytest` code:
```
<license>

import pytest
import numpy as np

from nomad.datamodel import EntryArchive
from <parserproject>.<parsername> import ParserName


def approx(value, abs=0, rel=1e-6):
    return pytest.approx(value, abs=abs, rel=rel)


@pytest.fixture(scope='module')
def parser():
    return <ParserName>()


def test_parser(parser):
    archive = EntryArchive()
    parser.parse(<path_to_test_mainfile>, archive, None)

    sec_run = archive.run[0]

    assert sec_run.program.name == '<PARSERNAME>'
    assert sec_run.program.version == 'x.x.x'

    sec_method = sec_run.method
    assert len(sec_method) == 1
    assert len(sec_method[0].force_field.model[0].contributions) == 1127
    assert sec_method[0].force_field.model[0].contributions[0].type == 'angle'

    sec_systems = sec_run.system
    assert len(sec_systems) == 2
    assert np.shape(sec_systems[0].atoms.positions) == (1516, 3)
    assert sec_systems[1].atoms.positions[800][1].magnitude == approx(2.4740036e-09)
    assert sec_systems[0].atoms.velocities[500][0].magnitude == approx(869.4773)
    assert sec_systems[1].atoms.lattice_vectors[2][2].magnitude == approx(2.469158e-09)

    sec_calc = sec_run.calculation
    assert len(sec_calc) == 5
    assert sec_calc[3].temperature.magnitude == approx(291.80401611328125)
    assert sec_calc[0].energy.total.value.magnitude == approx(-1.1863129365544755e+31)

    sec_workflow = archive.workflow2
    assert sec_workflow.m_def.name == 'WorkflowName'
```

The data for your tests should be stored in: `<path_to_test_mainfile> = <parserproject>/tests/data/<parsername>`.
Ideally, there should be an `assert` statement for each MetaInfo quantity that is populated with your parser.
