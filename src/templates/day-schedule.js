import React from "react"
import { graphql } from "gatsby"
import { Row, Col } from "antd"
import { Typography } from "antd"

import Page from "../components/layout"
import Theater from "../components/theater"
import Showtime from "../components/showtime"
import { GradeList } from "../components/grade"

export default ({ data }) => {
  return (
    <Page>
      <Typography.Title level={2}>{data.biffJson.dateStr}</Typography.Title>
      <GradeList />
      <Row type="flex" justify="start" gutter={16} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(screen => (
          <Col key={screen.theater}>
            <Theater name={screen.theater} />
            {screen.times.map(time => (
              <Showtime key={`${screen.theater}-${time.time}`} show={time} />
            ))}
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
      dateStr
      screening {
        theater
        times {
          time
          title
          grades
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
