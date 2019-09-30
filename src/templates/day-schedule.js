import React from "react"
import { graphql } from "gatsby"

import { Typography, Grid } from "@material-ui/core"

import Page from "../components/layout"
import Theater from "../components/theater"
import Showtime from "../components/showtime"
import { GradeList } from "../components/grade"

export default ({ data }) => {
  return (
    <Page>
      <Typography variant="h5">{data.biffJson.dateStr}</Typography>
      <GradeList />
      <Grid container spacing={2} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(screen => (
          <Grid item key={screen.theater} style={{ position: `relative` }}>
            <Theater name={screen.theater} />
            {screen.times.map(time => (
              <Showtime key={`${screen.theater}-${time.time}`} show={time} />
            ))}
          </Grid>
        ))}
      </Grid>
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
