import React from "react"

import { Typography } from "@material-ui/core"
import TheatersIcon from "@material-ui/icons/Theaters"

import Page from "../components/layout"

export default () => {
  return (
    <Page>
      <TheatersIcon style={{ fontSize: `4rem` }} />
      <Typography variant="h6" style={{ paddingTop: `2rem` }}>
        Film Festival Timetable
      </Typography>
    </Page>
  )
}
