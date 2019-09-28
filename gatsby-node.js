exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allBiffJson(sort: { fields: date }) {
        nodes {
          date
        }
      }
    }
  `)

  data.allBiffJson.nodes.forEach(node => {
    const date = node.date
    actions.createPage({
      path: date,
      component: require.resolve(`./src/templates/day-schedule.js`),
      context: { date: date },
    })
  })
}
