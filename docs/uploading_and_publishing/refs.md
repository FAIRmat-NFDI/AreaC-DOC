
## Best Practices: preparing the data and folder structure {#best-practices-preparing-folder-upload}

!!! warning
    Under construction.

## Upload limits

NOMAD limits the number of uploads and size of all its users. The following rules apply:

1- One upload cannot exceed **32 GB** in size.
2- An user can only be co-author of **10 non-published uploads** at the same time.
3- Only uploads with at least **one recognized entry** can be published.


## VASP POTCAR stripping

For VASP data, NOMAD takes care of the licensing of `POTCAR` files. In agreement with Georg Kresse, NOMAD extracts the most important information of the `POTCAR` file and stores them in a stripped version called `POTCAR.stripped`. The `POTCAR` files are then automatically removed from the upload and you can safely publish your data. 


## Glossary

!!! warning
    Under construction.

### NOMAD Graphical User Interface (GUI) {#gui}

### Processing {#processing}

### Parser {#parser}

### NOMAD Application Programming Interface (API) {#api}

### Entries {#entries}