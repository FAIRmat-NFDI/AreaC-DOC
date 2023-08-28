// Fetch and Parse YAML
fetch('assets/mkdocs.yml')
  .then(response => response.text())
  .then(text => {
    const jsyaml = window.jsyaml
    const cleanText = text.replace(/!!python\/[a-zA-Z:,_]+/g, '')  // jsyaml needs to clean up !!python labels or it does not work
    const yamlData = jsyaml.load(cleanText)
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
        name: 'grid'
      }
    })

    // Function to add nodes and edges to the graph
    function populateGraph(navData, parent = 'Home') {
      Object.keys(navData).forEach(key => {
        const label = key
        const value = navData[key]
    
        // Check if node already exists
        if (cy.getElementById(label).empty()) {
          // Add node
          cy.add({
            data: { id: label, label: label }
          })
        }
    
        // Check if edge already exists
        const edgeId = `${parent}_${label}`;
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
          populateGraph(value, label);
        }
      })
    }

    // Populate the initial graph
    cy.add({
      data: { id: 'Home', label: 'Home' }
    })

    populateGraph(navigationData)

    // Add click event to nodes
    cy.on('tap', 'node', function(evt){
      const nodeId = evt.target.id()
      // Assuming you want to navigate to the new page
      window.location.href = `${nodeId}.html`

      // Clear existing graph
      cy.elements().remove()

      // Add new graph based on the clicked node
      cy.add({
        data: { id: nodeId, label: nodeId }
      })

      populateGraph(navigationData[nodeId], nodeId)
    })

  })