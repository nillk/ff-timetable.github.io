exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allSipffJson(sort: { fields: date }) {
        nodes {
          date
        }
      }
    }
  `)

  data.allSipffJson.nodes.forEach(node => {
    const date = node.date
    actions.createPage({
      path: date,
      component: require.resolve(`./src/templates/day-schedule.js`),
      context: { date: date },
    })
  })
}
