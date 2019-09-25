import React from "react"
import { graphql } from "gatsby"
import { Row, Col } from "antd"
import { Typography, Popover } from "antd"

import Page from "../components/layout"
import DescriptionPopover from "../components/description-popover"

const TIME_HEIGHT = 75

export default ({ data }) => {
  return (
    <Page>
      <Typography.Title>{`Day ${data.biffJson.date.substring(3, 5)}`}</Typography.Title>
      <Row type="flex" justify="start" gutter={16} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(theater => (
          <Col>
            <div
              style={{
                padding: `4px`,
                height: `80px`,
                width: `80px`,
                backgroundColor: `#FFF`,
              }}
            >
              {theater.theater}
            </div>
            {theater.times.map(time => (
              <div
                style={{
                  border: `1px solid #FFF`,
                  position: `absolute`,
                  width: `80px`,
                  top: `${calculateTop(time.time)}px`,
                  height: `${calculateHeight(time.programs)}px`,
                  wordBreak: `keep-all`,
                }}
              >
                <span style={{ display: `block`, fontWeight: `bold` }}>
                  {time.time}
                </span>
                <Popover placement="bottom" arrowPointAtCenter content={<DescriptionPopover programs={time.programs}/>}>
                  <span>{time.title}</span>
                </Popover>
              </div>
            ))}
          </Col>
        ))}
      </Row>
    </Page>
  )
}

const calculateTop = time => {
  const [hour, minute] = time.split(":").map(Number)
  const hourDiff = hour - 10
  const minuteDiff = minute / 60

  return (hourDiff + minuteDiff) * TIME_HEIGHT + 96
}

const calculateHeight = programs => {
  const totalLength = programs.reduce((acc, program) => {
    const length =
      program.info !== null ? Number(program.info.length.replace("min", "")) : 0

    return acc + length
  }, 0)

  return (totalLength / 60) * TIME_HEIGHT
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
