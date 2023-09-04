# AreaC-DOC
Repository containing the Area C specific documentation for using NOMAD for computational data.


We organized the information in correlated sections:
1. [Uploading and publishing your data in NOMAD.](https://fairmat-nfdi.github.io/AreaC-DOC/uploading_and_publishing_data/intro/)
2. [Custom schemas for new features.](https://fairmat-nfdi.github.io/AreaC-DOC/custom_schemas_for_new_features/intro/)
3. [Writing a parser plugin.](https://fairmat-nfdi.github.io/AreaC-DOC/writing_a_parser_plugin/intro/)
4. [Normalizing the parsed metadata.](https://fairmat-nfdi.github.io/AreaC-DOC/normalizing_the_parsed_metadata/intro/)
5. [Querying and performing Data Science with NOMAD.](https://fairmat-nfdi.github.io/AreaC-DOC/querying_and_performing_Data_Science/intro/)
6. [Visualizing properties in the entry page.](https://fairmat-nfdi.github.io/AreaC-DOC/visualizing_properties_in_the_entry_page/intro/)
7. [Defining filters for searches.](https://fairmat-nfdi.github.io/AreaC-DOC/defining_filters_for_searches/intro/)
8. [Current features.](https://fairmat-nfdi.github.io/AreaC-DOC/current_features/intro/)


### How to launch locally for debugging

In the workflow-documentation directory, create your own virtual environment with Python3.9:
```
python3 -m venv .pyenvdoc
```
and activate it in your shell:
```
. .pyenvdoc/bin/activate
```

Make sure you have the latest pip version:
```
pip install --upgrade pip
```

Pip-install the `requirements.txt` file:
```
pip install -r requirements.txt
```

Launch locally:
```
mkdocs serve
```

The output on the terminal should have these lines:
```
...
INFO     -  Building documentation...
INFO     -  Cleaning site directory
INFO     -  Documentation built in 0.29 seconds
INFO     -  [14:31:29] Watching paths for changes: 'docs', 'mkdocs.yml'
INFO     -  [14:31:29] Serving on http://127.0.0.1:8000/
...
```
Then click on the http address to launch the MKDocs.

<!--
### Updating `docs/code/mkdocs.yaml` before pushing

In order to show the node graph in the documentation page, the file `docs/code/mkdocs.yml` has to be updated if the main one under root is changed (e.g., when adding a new sub-section or content to `nav`). We suggest you to directly copy the new `mkdocs.yml` in root to `docs/code/mkdocs.yml` before pushing by doing:
```
cp mkdocs.yml docs/code/mkdocs.yml
```
-->
