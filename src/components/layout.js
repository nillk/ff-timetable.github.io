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
        allSipffJson(sort: { fields: date }) {
          nodes {
            date
          }
        }
      }
    `}
    render={data => (
      <Layout>
        <Header>
          <Link to={`/`} key={`/`} style={{ width: `3rem` }}>
            HOME
          </Link>
          {getDateLinks(data)}
        </Header>
        <Content className="content">{children}</Content>
      </Layout>
    )}
  />
)

const getDateLinks = data => {
  return data.allSipffJson.nodes.map(node => {
    const date = node["date"]
    return (
      <Link to={`/${date}`} key={date} style={{ width: `1.8rem` }}>
        {`${date.substring(3, 5)}`}
      </Link>
    )
  })
}
