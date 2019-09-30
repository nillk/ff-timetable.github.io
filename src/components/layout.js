import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"

import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider } from "@material-ui/core/styles"
import theme from "../theme"

import "../../fonts/spoqa-han-sans.css"
import "./layout.css"

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
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="layout">
          <div className="header">
            <Link to={`/`} key={`/`}>
              Home
            </Link>
            {getDateLinks(data)}
          </div>
          <div className="content">{children}</div>
        </div>
      </MuiThemeProvider>
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
