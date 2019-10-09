import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import { Layout } from "antd"

import "../../fonts/spoqa-han-sans.css"
import "./theme.less"

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
      <Layout>
        <Header>
          <Link to={`/`} key={`/`}>
            Home
          </Link>
          {getDateLinks(data)}
        </Header>
        <Content className="content">
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
      <Link to={`/${date}`} key={date}>
        {`Day${date.substring(3, 5)}`}
      </Link>
    )
  })
}
