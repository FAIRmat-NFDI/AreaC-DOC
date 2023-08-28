// Fetch and Parse YAML
fetch('assets/mkdocs.yml')
  .then(response => response.text())
  .then(text => {
    const jsyaml = window.jsyaml
    const cleanText = text.replace(/!!python\/[a-zA-Z:,_]+/g, '')  // jsyaml needs to clean up !!python labels or it does not work
    const yamlData = jsyaml.load(cleanText)
    // Getting the nav data from the mkdocs.yml file to plot the graph
    const navigationData = yamlData.nav

    // Initialize the Cytoscape instance here
    const cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'cose', // use 'cose' for force-directed layout
        idealEdgeLength: 1,
        nodeOverlap: 1000
      }
    })

    // Function to add nodes and edges to the graph
    function populateGraph(navData, parent = 'Home') {
      if (Array.isArray(navData)) {
        // If navData is an array, loop through each element
        navData.forEach(item => {
          const label = Object.keys(item)[0]  // The key is the label
          const value = item[label]  // The value is another object or array
          addNodeAndEdge(label, value, parent)
        });
      } else {
        // If navData is an object, loop through each property
        Object.keys(navData).forEach(label => {
          const value = navData[label]
          addNodeAndEdge(label, value, parent)
        });
      }
      // Re-run layout with potentially modified settings
      cy.layout({
        name: 'cose',
        idealEdgeLength: 1,
        nodeOverlap: 1000
      }).run()
    }

    // Function to add a single node and edge to the graph
    function addNodeAndEdge(label, value, parent) {
      // Check if the node label is 'Introduction'
      if (label === 'Introduction') {
        // Update the introPath of the parent node
        cy.getElementById(parent).data('introPath', value)
        return
      }

      // Check if node already exists
      if (cy.getElementById(label).empty()) {
        // Add node
        cy.add({
          data: {
            id: label,
            label: label
          }
        })
      }

      // Check if edge already exists
      const edgeId = `${parent}_${label}`
      if (cy.getElementById(edgeId).empty()) {
        // Add edge
        cy.add({
          data: {
            id: edgeId,
            source: parent,
            target: label
          }
        })
      }

      if (typeof value === 'object') {
        populateGraph(value, label)
        cy.layout({ name: 'cose' }).run()
      }
    }


    // Populate the initial graph
    cy.add({
      data: {
        id: 'Home',
        label: 'Home'
      }
    })

    populateGraph(navigationData)

    // Add click event to nodes
    cy.on('tap', 'node', function(evt){
      const nodeId = evt.target.id()
      const introPath = evt.target.data('introPath')  // Get introPath if it exists
      // Choose URL based on whether introPath exists
      const newUrl = introPath ? introPath.replace('.md', '') : `${nodeId.replace(/ /g, '_').toLowerCase()}/intro`

      // Assuming you want to navigate to the new page
      window.location.href = newUrl

      // Clear existing graph
      cy.elements().remove()

      // Add new graph based on the clicked node
      cy.add({
        data: { id: nodeId, label: nodeId }
      })

      populateGraph(navigationData[nodeId], nodeId)
      // Re-run layout
      cy.layout({
        name: 'cose',
        idealEdgeLength: 1,
        nodeOverlap: 1000
      }).run()
    })

  })