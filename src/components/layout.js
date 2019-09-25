import React from "react"
import { Layout } from "antd"
import { StaticQuery, graphql, Link } from "gatsby"

const { Header, Content } = Layout

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
        allBiffJson(sort: { fields: date }) {
          nodes {
            date
          }
        }
      }
    `}
    render={data => (
      <Layout style={{ minHeight: `100vh` }}>
        <Header>
          <Link to={`/`} key={`/`}>
            Home
          </Link>
          {getDateLinks(data)}
        </Header>
        <Content style={{ overflow: `auto`, padding: `25px 50px` }}>
            {children}
        </Content>
      </Layout>
    )}
  />
)

const getDateLinks = data => {
  return data.allBiffJson.nodes.map(node => {
    const date = node["date"]
    return (
      <Link to={`/${date}`} key={date} style={{ marginLeft: `8px` }}>
        {date}
      </Link>
    )
  })
}
