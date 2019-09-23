import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

import style from './day-schedule.module.css'

const TIMES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const TIME_HEIGHT = 90

export default ({ data }) => {
  return (
    <Layout>
      <h1>{data.biffJson.date}</h1>
      <div>
        <div style={{ float: `left`, paddingTop: `72px` }}>
          {TIMES.map(time => (
            <div style={{ height: `${TIME_HEIGHT}px` }}>{time}</div>
          ))}
        </div>
        {data.biffJson.screening.map(theater => (
          <div
            style={{
              float: `left`,
              position: `relative`,
              width: `72px`,
              marginLeft: `12px`,
            }}
          >
            <div
              style={{
                marginBottom: `8px`,
                padding: `4px`,
                height: `72px`,
                width: `72px`,
                backgroundColor: `lightcoral`,
              }}
            >
              {theater.theater}
            </div>
            {theater.times.map(time => (
              <div
                className={style.film}
                style={{
                  border: `1px solid peachpuff`,
                  position: `absolute`,
                  width: `72px`,
                  top: `${calculateTop(time.time)}px`,
                  height: `${calculateHeight(time.programs)}px`,
                }}
              >
                <span style={{ display: `block` }}>{time.time}</span>
                <span>{time.title}</span>
                <div className={style.desc}>{time.programs[0].desc}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  )
}

const calculateTop = time => {
  const [hour, minute] = time.split(":").map(Number)
  const hourDiff = hour - TIMES[0]
  const minuteDiff = minute / 60

  return (hourDiff + minuteDiff) * TIME_HEIGHT + 72
}

const calculateHeight = programs => {
  const totalLength = programs.reduce((acc, program) => {
    return acc + Number(program.info.length.replace("min", ""))
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
            }
          }
        }
      }
    }
  }
`
