import React from "react"
import { graphql } from "gatsby"
import { Row, Col } from "antd"
import { Typography } from "antd"

import Page from "../components/layout"
import Theater from "../components/theater";
import Showtime from "../components/showtime";

export default ({ data }) => {
  return (
    <Page>
      <Typography.Title>{`Day ${data.biffJson.date.substring(3, 5)}`}</Typography.Title>
      <Row type="flex" justify="start" gutter={16} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(screen => (
          <Col>
            <Theater name={screen.theater} />
            {screen.times.map(time => <Showtime show={time} />)}
          </Col>
        ))}
      </Row>
    </Page>
  )
}

export const query = graphql`
  query($date: String!) {
    biffJson(date: { eq: $date }) {
      date
      screening {
        theater
        times {
          time
          title
          programs {
            title
            titleEng
            desc
            info {
              length
              genre
            }
          }
        }
      }
    }
  }
`
