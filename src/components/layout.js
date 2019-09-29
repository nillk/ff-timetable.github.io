import React from "react"
import { Layout } from "antd"
import { StaticQuery, graphql, Link } from "gatsby"

import style from "./layout.module.css"

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
        <Header className={style.header}>
          <Link to={`/`} key={`/`} style={{ color: `#FFF` }}>
            Home
          </Link>
          {getDateLinks(data)}
        </Header>
        <Content className={style.content}>
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
      <Link
        to={`/${date}`}
        key={date}
        style={{ marginLeft: 8, color: `#FFF` }}
      >
        {`Day${date.substring(3, 5)}`}
      </Link>
    )
  })
}
