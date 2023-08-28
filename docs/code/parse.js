
fetch('code/mkdocs.yml')
  .then(response => response.text())
  .then(data => {
    const yaml = jsyaml.load(data)
    const nav = yaml.nav
    console.log(nav)
  })