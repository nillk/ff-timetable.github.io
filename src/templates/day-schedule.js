import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

import style from "./day-schedule.module.css"

const TIME_HEIGHT = 75

export default ({ data }) => {
  return (
    <Layout>
      <h1>{data.biffJson.date}</h1>
      <div style={{ display: `flex` }}>
        {data.biffJson.screening.map(theater => (
          <div
            style={{
              float: `left`,
              position: `relative`,
              width: `72px`,
              marginRight: `12px`,
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
                  border: `1px solid lightcoral`,
                  position: `absolute`,
                  width: `72px`,
                  top: `${calculateTop(time.time)}px`,
                  height: `${calculateHeight(time.programs)}px`,
                }}
              >
                <span style={{ display: `block`, fontWeight: `bold` }}>
                  {time.time}
                </span>
                <span>{time.title}</span>
                <div className={style.desc}>
                  {time.programs[0].info &&
                    time.programs[0].info.genre &&
                    time.programs[0].info.genre.map(g => (
                      <span
                        key={g}
                        style={{
                          display: `inline-block`,
                          backgroundColor: `white`,
                          color: `black`,
                          opacity: `0.4`,
                          marginRight: `2px`,
                          padding: `0px 2px 0px 2px`,
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  <div>{time.programs[0].desc}</div>
                </div>
                {/* TODO */}
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
  const hourDiff = hour - 10
  const minuteDiff = minute / 60

  return (hourDiff + minuteDiff) * TIME_HEIGHT + 72
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
