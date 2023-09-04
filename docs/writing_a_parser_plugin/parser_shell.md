# Creating the framework for your parser

First, create a directory for your parser under the relevant parser project directory:

    cd dependencies/parsers/<parserproject>
    mkdir <parsername>

In the following please note the naming conventions:

- <parsername\> - flat case, e.g., quantumespresso

- <ParserName\> - Pascal case, e.g., QuantumEspresso

- <parser_name\> - snake case, e.g., quantum_espresso

- <PARSERNAME\> - upper flat case, e.g., QUANTUMESPRESSO
<!-- TODO state which convention is used where, i.e. filenames, classes, etc.  -->

### Parser files

In the following, <license\> represents the insertion of the following license agreement statement:

    #
    # Copyright The NOMAD Authors.
    #
    # This file is part of NOMAD.
    # See https://nomad-lab.eu for further info.
    #
    # Licensed under the Apache License, Version 2.0 (the "License");
    # you may not use this file except in compliance with the License.
    # You may obtain a copy of the License at
    #
    #     http://www.apache.org/licenses/LICENSE-2.0
    #
    # Unless required by applicable law or agreed to in writing, software
    # distributed under the License is distributed on an "AS IS" BASIS,
    # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    # See the License for the specific language governing permissions and
    # limitations under the License.
    #


The following are typical files found within a parser source directory:

- `__init__.py`

        <license>
        from .parser import <ParserName>Parser

- `__main__.py`

        <license>
        import sys
        import json
        import logging

        from nomad.utils import configure_logging
        from nomad.datamodel import EntryArchive
        from atomisticparsers.<parsername> import <ParserName>Parser

        if __name__ == "__main__":
            configure_logging(console_log_level=logging.DEBUG)
            archive = EntryArchive()
            <ParserName>Parser().parse(sys.argv[1], archive, logging)
            json.dump(archive.m_to_dict(), sys.stdout, indent=2)

- `metainfo/__init__.py`

        <license>
        from nomad.metainfo import Environment

        from . import <parsername>

        m_env = Environment()
        m_env.m_add_sub_section(Environment.packages, <parsername>.m_package)

- `metainfo/<parser_name>.py` - contains [code-specific metadata definitions](creating_new_metainfo.md#code-specific-metainfo).

- `nomad_plugin.yaml`

        code_category: <Parserproject> code
        code_homepage: <>
        code_name: <PARSERNAME>
        metadata:
        codeCategory: <Parserproject> code
        codeLabel: <PARSERNAME>
        codeLabelStyle: All in capitals
        codeName: <parsername>
        codeUrl: <>
        parserDirName: dependencies/parsers/<parserproject>/<parserproject>parsers/parsername/
        parserGitUrl: https://github.com/nomad-coe/<parserproject>-parsers.git
        parserSpecific: ''
        preamble: ''
        status: production
        tableOfFiles: ''
        name: parsers/<parsername>
        parser_class_name: <parserproject>parsers.<parsername>.parser.<ParserName>Parser
        python_package: <parserproject>parsers.<parsername>

- `parser.py` - the [parser source code](computational.md).

- `README.md` - a short description of the functionality of this parser.

### Integration into NOMAD's parser-matching interface

The `nomad_plugin.yaml` file enables the parser to be recognized as a plugin to the NOMAD software.
However, in order for NOMAD to identify that it should use this parser, we still need to add
configuration details within NOMAD's parser-matching interface. These options are specified within
the plugins options (`plugins = Plugins(options={}))`)  in the file `nomad/config/__init__.py`.
There are many examples to follow here. In short, we need to create a dictionary key within `options`
for our new parser:

    'parsers/<parsername>': Parser(
        python_package='<parserproject>parsers.<parsername>',
        <args>
        )

Here, `<args>` can be one or several of the following:

- `mainfile_name_re=` - regex string for matching mainfile name
- `mainfile_contents_re=` - regex string for matching mainfile contents
- `mainfile_mime_re=` -
- `supported_compressions=` -
- `mainfile_alternative=` -
- `mainfile_binary_header_re=` -
- `mainfile_contents_dict={'__has_all_keys': ['<key1>', '<key2>'}),`
- `parser_as_interface=` -

You can find further information about this topic here: [Examples of parser-matching](references/examples_parser_matching.md)
