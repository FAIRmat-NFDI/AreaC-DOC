!!! warning
    Under construction.


<!--
1. `SystemNormalizer`
2. `OptimadeNormalizer`
3. `DosNormalizer`
4. `BandStructureNormalizer`
5. `SpectraNormalizer`
6. `WorkflowNormalizer`
7. `ResultsNormalizer`
8. `MetainfoNormalizer`

In addition to these normalizers, each NOMAD section definition can have a `normalize()` Python function defined which will be executed before, if the section is populated. An example of these can be found for the `workflow2` sections defined in [`/nomad/datamodel/metainfo/simulation/workflow.py`](https://github.com/nomad-coe/nomad/blob/develop/nomad/datamodel/metainfo/simulation/workflow.py#L122):
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
-->