import React from "react"
import { Typography, Icon } from "antd"

import Page from "../components/layout"

import "antd/dist/antd.css"

export default () => {
  return (
    <Page>
      <Typography>
        <Typography.Title><Icon type="video-camera" /> Film Festival Timetable</Typography.Title>
      </Typography>
    </Page>
  )
}
