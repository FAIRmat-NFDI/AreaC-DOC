# AreaC-DOC
Repository containing the Area C specific documentation for using NOMAD for computational data.


We organized the information in correlated sections:
1. Uploading and publishing your data in NOMAD.
2. Custom schemas for new features.
3. Querying and performing Data Science with NOMAD.
4. Writing a parser plugin.
5. Current features.
6. Normalizing the parsed metadata.
7. Visualizing properties in the entry page.
8. Defining filters for searches.


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

Pip-install `mkdocs` and `mkdocs-material`:
```
pip install mkdocs
pip install mkdocs-material
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
