import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'

export default ({ children }) => (
  <StaticQuery
    query={graphql`
        query {
            allBiffJson(sort: {fields: date}) {
                nodes {
                    date
                }
            }
        }
    `}
    render={data => (
        <div>
            <div>
                <Link to={`/`} key={`/`}>Home</Link>
                {getDateLinks(data)}
            </div>
            {children}
        </div>
    )}
  />
)

const getDateLinks = (data) => {
    return data.allBiffJson.nodes.map(node => {
        const date = node['date']
        return (<Link to={`/${date}`} key={date}>{date}</Link>);
    });
}
