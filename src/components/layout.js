import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"

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
      <div style={{ padding: `24px` }}>
        <div style={{ marginBottom: `16px` }}>
          <Link to={`/`} key={`/`}>
            Home
          </Link>
          {getDateLinks(data)}
        </div>
        {children}
      </div>
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
