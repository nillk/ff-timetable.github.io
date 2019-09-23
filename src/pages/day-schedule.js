import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

export default ({ data }) => {
    return (
        <Layout>
            <h1>{data.biffJson.date}</h1>
            <ul>
                {data.biffJson.screening.map((theater, index) => (
                    <li key={index}>{theater.theater}</li>
                ))}
            </ul>
        </Layout>
    )
}

export const query = graphql`
    query($date: String!) {
        biffJson(date: {eq: $date}) {
            date
            screening {
                theater
            }
        }
    }
`