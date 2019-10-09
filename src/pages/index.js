import React from "react"
import { Typography, Icon } from "antd"

import Page from "../components/layout"

export default () => {
  return (
    <Page>
      <Typography style={{ paddingTop: `2rem` }}>
        <Typography.Title>
          <Icon type="video-camera" /> Film Festival Timetable
        </Typography.Title>
      </Typography>
    </Page>
  )
}
