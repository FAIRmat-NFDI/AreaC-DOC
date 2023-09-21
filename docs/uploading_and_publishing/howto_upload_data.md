
Uploading data in NOMAD is a very easy task which can be done in two ways: 

- Upload data by dragging-and-dropping your files into the `PUBLISH > Uploads` page.
- Using the shell command `curl` for sending files to the upload.

The first situation is suitable for users who have a relatively small amount of data or who want to test [how the processing works](explanation_how_the_processing_works.md). The second situation is suitable for users who have larger datasets and need to automatize the upload via the terminal using `curl`.

You can upload the files one by one, or you can also zip them in [`.zip`](https://copyrightservice.co.uk/reg/creating-zip-files) or `.tar.gz` formats to upload a larger amount of files at once. 

We suggest you to visit the [References](refs.md) page and read our [Best Practices](refs.md/#best-practices-preparing-folder-upload) section to see what are the best practices to organize data in a directory tree prior to upload it.


## Drag-and-drop uploads

On the top-left menus, click on `PUBLISH > Uploads`.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/upload_menu.png" alt="Uploads page" width="90%" title="Uploads page.">
    </label>
</div>


You can then click on `CREATE A NEW UPLOAD` or try one of the example uploads by clicking in `ADD EXAMPLE UPLOADS` and selecting one of the multiple options. In our case, we will use a zip file with some computational data.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/gwupload.gif" alt="GW upload gif" width="90%" title="Creating a new upload with DFT+GW data.">
    </label>
</div>


After the files are uploaded, a [processing](refs.md/#processing) is triggered and NOMAD tries to recognize the data with its corresponding [parser](refs.md/#parser). Please, visit [Explanation - how the processing works](explanation_how_the_processing_works.md) to gain further insight in the process. You will receive an email when the upload processing is finished.


## Command-line uploads

!!! warning
    Under construction.


## Summary of the Uploads page

The uploads page allows you to modify certain general metadata fields.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/top_fields_uploads.png" alt="Top fields in uploads page." width="90%" title="Top fields in uploads page.">
    </label>
</div>

The name of the upload can be modify by clicking on the pen icon (:fontawesome-solid-pen:). The other icons correspond to:

<!--Confirm with Lauri the icons-->
- :fontawesome-solid-user-group: _Manage members_: allows users to invite collaborators by defining co-authors and reviewers roles.
- :fontawesome-solid-cloud-arrow-down: _Download files_: downloads all files present in the upload.
- :fontawesome-solid-rotate-left: _Reload_: reloads the uploads page.
- :fontawesome-solid-rotate: _Reprocess_: triggers the processing of the uploaded data.
- :fontawesome-solid-angle-left::fontawesome-solid-angle-right: _API_: generates a JSON response to use by the [NOMAD API](refs.md/#api). See [Querying and performing Data Science](../querying_and_performing_Data_Science/intro.md) for more information.
- :fontawesome-solid-trash: _Delete the upload_: deletes completely the upload.

The files and folder structure is shown in the first section, _(1) Prepare and upload your files_.

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/upload_files.png" alt="Uploaded files." width="90%" title="Uploaded files.">
    </label>
</div>

The second section _(2) Process data_ shows the processed data and the generated [entries](refs.md/#entries) in NOMAD.

The third section _(3) Edit author metadata_ allows users to edit certain metadata fields from all entries recognized in the upload. This includes _comments_, where you can add as much extra information as you want, _references_, if the data is publicly available in some URL (e.g., an article DOI), and _datasets_, which allow to create or add the uploaded data into a more general dataset (please, see [How-to organize data in datasets](howto_organize_data_in_datasets.md)).

<div class="click-zoom">
    <label>
        <input type="checkbox">
        <img src="/assets/uploading_and_publishing/edit_author_metadata.png" alt="Edit author metadata." width="50%" title="Edit author metadata.">
    </label>
</div>

The final section _(4) Publish_ lets the user to publish the data with or without an embargo. This will be explained more in detail in [How-to publish data](howto_publish_data.md). After publishing by clicking on `PUBLISH`, the uploaded files are immutable. However, you can still edit the metadata fields in point (3).
