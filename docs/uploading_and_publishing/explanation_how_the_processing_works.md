
In the previous section, [How-to upload data](howto_upload_data.md), we showed that when the data was dropped in the Uploads page, a **processing** of the raw data was triggered.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/gwupload.gif" alt="GW upload gif" width="90%" title="Creating a new upload with DFT+GW data.">
    </label>
</div>


Once the data is added to the upload, NOMAD interprets the files and divides them into: **mainfiles** and **auxiliary** files. 

The **mainfiles** are those files which are representative of a given computational calculation. In NOMAD, we support several computational codes for first principles, lattice modeling, and classical molecular dynamics simulations, as well as workflow managers and databases. For each code, NOMAD recognize one file as the mainfile. For example, the [VASP](https://www.vasp.at/) mainfile is by default the `vasprun.xml`, although if the `vasprun.xml` is not present in the upload NOMAD searches the `OUTCAR` file and assigns it as the mainfile[^1].


[^1]: Please, check our note [References > VASP POTCAR stripping](refs.md/#vasp-potcar-stripping).


The rest of files which are not the mainfile are recognized as **auxiliary** files. These can have several purposes and be supported and recognized by NOMAD. For example, the `band*.out` or `GW_band*` files in [FHI-aims](https://fhi-aims.org/) are auxiliary files that allows NOMAD to recognize band structures in DFT and GW, respectively.

You can see the full list of supported codes, mainfiles, and auxiliary files in the general NOMAD documentation under [Supported parsers](https://nomad-lab.eu/prod/v1/staging/docs/reference/parsers.html).

We recommend you to keep as much auxiliary files as possible together with the mainfile, but without reaching the [uploads limits](refs.md/#uploads-limits). Please, also check our recommendations on [Best Practices: preparing the data and folder structure](refs.md/#best-practices-preparing-folder-upload).


## Structured data with the NOMAD metainfo

Once the mainfile and auxiliary files have been recognized, a new [entry](../glossary/glossary.md/#entries) in NOMAD is created and a specific [parser](#parsing) is executed. You can check more details in [Writing a parser plugin](../writing_a_parser_plugin/parser_plugin_overview.md) on how to add new parsers in order for NOMAD to support new codes.

In this new entry, NOMAD generates a **NOMAD archive** section. This will contain all the (meta)information extracted from the unstructured raw data files but in a _structured_, _well defined_, and _machine readable_ format. We define the **NOMAD metainfo** as all the set of [sections, sub-sections](../glossary/glossary.md/#metadata-sections), and [quantities](../glossary/glossary.md/#metadata-quantities) used to structure the raw data into a structured _schema_. You can further read in the general NOMAD documentation page in [Learn > Structured data](https://nomad-lab.eu/prod/v1/staging/docs/learn/data.html).

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/nomad_metainfo.png" alt="The NOMAD metainfo." width="90%" title="The NOMAD metainfo.">
    </label>
</div>


## NOMAD sections for computational data

Under the entry `archive` section, there are several main sections being populated by the parsers. For computational data, the only populated ones are:

- `metadata`: contains general and non-code specific metadata. This is mainly information about authors, creation of the entry time, identificators (id), etc.
- `run`: contains the **parsed** and **normalized** raw data into the structured NOMAD schema. This is all the possible raw data which can be translated into a structured way.
- `workflow2`: contains metadata about the specific workflow done in the entry. This is mainly a set of well-defined workflows, e.g., `GeometryOptimization`, and their parameters.
- `results`: contains the **normalized** and **indexed** metadata. This is mainly linked with searching, filtering, and visualizing data in NOMAD.

??? question "`workflow` and `workflow2` sections: refactoring and deprecating"
    You have probably noticed the name `workflow2` but also the existence of a section called `workflow` under `archive`. This is because
    `workflow` is an old version of the workflow section, while `workflow2` is the newest one. `workflow` is still present in some of the older entries, so 
    that until the full NOMAD repository and its entries are reprocessed with the new section `workflow2`, we need to maintain the old section.
    This is an usual practice in our development process, especially for sections which needs refactoring.


### Parsing {#parsing}

A parser is a Python script which reads the code-specific mainfile and auxiliary files and populates the `run` and `workflow2` sections, and all the sub-sections and quantities defined therein. We explain them more in detail in [Writing a parser plugin](../writing_a_parser_plugin/parser_plugin_overview.md). 

Parsers can be added to NOMAD as _plugins_ and are divided in a set of Github sub-projects under the [main NOMAD repository](https://github.com/nomad-coe/nomad). The path to these projects can be found in `/dependencies/parsers/<project>` and they are:

- [atomistic](https://github.com/nomad-coe/atomistic-parsers): parsers for classical molecular and atomistic simulations, e.g., from Gromacs, Lammps, etc.
- [database](https://github.com/nomad-coe/database-parsers): parsers for various databases, e.g., OpenKim.
- [eelsdb](https://github.com/nomad-coe/nomad-parser-eelsdb): parser for the [EELS database](https://eelsdb.eu/). To be integrated in the database project.
- [electronic](https://github.com/nomad-coe/electronic-parsers): parsers for electronic structure calculations, e.g., VASP, FHI-aims, etc.
- [nexus](https://github.com/nomad-coe/nomad-parser-nexus): parsers for combining various instrument output formats and electronic lab notebooks.
- [workflow](https://github.com/nomad-coe/workflow-parsers): parsers for task managers and workflow schedulers.

!!! tip "External contributions"
    We always welcome external contributions for new codes and parsers in our repositories. Furthermore, we are always happy to hear feedback and implement new features
    into our parsers. Please, feel free to reach to us by email or by opening an issue in one of the Github repositories and we will promptly reach out back to help you!


### Normalizing

After the parsing populates `run` and `workflow2` sections, a new layer of Python scripts is executed on top of the processed NOMAD metadata. This has two main purposes: one, normalize or _homogenize_ certain metadata parsed from different codes, and two, populate the `results` section. We explain them more in detail in [Normalizing the parsed metadata](../normalizing_the_parsed_metadata/intro.md)

The development of normalizers in NOMAD is usually an internal process, as it requires across-codes and across-areas robustness, because these are applied to both computational and experimental metadata. Furthermore, it is linked with the indexing and searching of data (see next section).

The set of normalizers relevant for computational data are listed in [`/nomad/config/models.py`](https://github.com/nomad-coe/nomad/blob/develop/nomad/config/models.py#L383) and are executed in order as:

1. `SystemNormalizer`: TODO
2. `OptimadeNormalizer`: TODO
3. `DosNormalizer`: TODO
4. `BandStructureNormalizer`: TODO
5. `SpectraNormalizer`: TODO
6. `WorkflowNormalizer`: TODO
7. `ResultsNormalizer`: TODO
8. `MetainfoNormalizer`: TODO

Besides these normalizers, each NOMAD section can have a `normalize()` Python function defined which will be executed before, if the section is populated. An example of these can be found for the `workflow2` sections defined in [`/nomad/datamodel/metainfo/simulation/workflow.py`](https://github.com/nomad-coe/nomad/blob/develop/nomad/datamodel/metainfo/simulation/workflow.py#L122):
```python
class YourWorkflow(Workflow):
    /* Define SubSections and Quantities here. */
    
    quantity_1 = Quantity(type=int, description='''My quantity number 1.''')

    sub_section_1 = SubSection(sub_section=AnotherSection)

    def normalize(self, archive, logger):
        super().normalize(archive, logger)
        
        /* Normalize the SubSections and Quantities here. */
        if self.quantity_1 == 2:
            // Do something
        // ...
```


### Indexing (and storing)

The last step is to store the structured metadata and pass some of it to the search index. The metadata which is passed to the search index is defined in the `results` section. These metadata can be then searched by [filtering in the Entries page of NOMAD](../defining_filters_for_searches/intro.md) or by writing a Python script which [searches using the NOMAD API](../querying_and_performing_Data_Science/intro.md).


## Entries OVERVIEW page

Once the parsers and normalizers finish, the Uploads page will show if the processing of the entry was a `SUCCESS` or a `FAILS`. The entry information can be browsed by clicking on the :fontawesome-solid-arrow-right: icon. 

You will land on the `OVERVIEW` page of the entry. On the top menus you can further select the `FILES` page, the `DATA` page, and the `LOGS` page.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/overview_page.png" alt="Overview page." width="90%" title="Overview page.">
    </label>
</div>

This page contains a summary of the parsed metadata, e.g., in which material was the calculation performed on, which type of methodology was done (in the example, G0W0 approximation done with the code [exciting](https://www.exciting-code.org/)), and the visualization of some properties. We note that all these is metadata read directly from `results`.

### LOGS page

In the `LOGS` page, you can find information about the processing. You can find error, warning, and critical messages which will give you an insight if a processing of an entry was a `FAILS`.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/logs_page.png" alt="Logs page." width="90%" title="Logs page.">
    </label>
</div>

!!! tip "Bugs reporting"
    We recommend you to contact us in case you find `FAILS` situations. These are bugs which we are fixing, and whose origin might be varied: from a new version
    of a code which is not yet supported to wrong handling of potential errors in the parser script. Please, feel free to reach to us by email or by opening an issue 
    in one of the Github repositories and we will promptly reach out back to help you!


### DATA page

The `DATA` page contains all the structured NOMAD metainfo populated by the parser and normalizers. This is the most important page in the entry, as it contains all the relevant metadata which will allow users to find that specific simulation.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/data_page.png" alt="Data page." width="90%" title="Data page.">
    </label>
</div>

