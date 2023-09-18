# H5MD-NOMAD: A flexible data-storage schema for uploading molecular simulations to NOMAD

Most computational data in NOMAD is harvested with code-specific parsers that recognize the output files from a particular software and retrieve the appropriate (meta)data accordingly.
However, this approach is not possible for many modern molecular simulation engines that use fully-flexible scriptable input and non-fixed output files.
["HDF5 for molecular data" (H5MD)](http://h5md.nongnu.org/) is a data schema for storage of molecular simulation data, based on the HDF5 file format.
The following pages describe an extension of the H5MD schema, denoted H5MD-NOMAD, which adds specificity to several of the H5MD guidelines while also retaining reasonable flexibility. This enables simulation data stored according to the H5MD-NOMAD schema to be parsed and normalized by NOMAD, while also allowing the user some freedom for customization.

**Due to the new nature of extending upon the original H5MD schema, portions of these doc pages were duplicated, extended, or summarized from the [H5MD webpage](http://h5md.nongnu.org/).**

## Introduction to the H5MD storage format

H5MD was originally proposed by P. de Buyl, P. H. Colberg and F. Höfling in [H5MD: A structured, efficient, and portable file format for molecular data](http://dx.doi.org/10.1016/j.cpc.2014.01.018), Comp. Phys. Comm. 185, 1546–1553 (2014) [[arXiv:1308.6382](http://arxiv.org/abs/1308.6382)]. The schema is maintained, along with associated tools, in a GitHub repository: [H5MD GitHub](https://github.com/h5md).

The basic nomenclature of the H5MD schema relevant for understanding H5MD-NOMAD can be found here: [Quick Start - H5MD basics](references/quick_H5MD_basics.md). Moreover, many of the details of the H5MD structure will be necessarily covered through the explanation of H5MD-NOMAD.


