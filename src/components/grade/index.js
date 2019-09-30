import React from "react"

import Badge from "@material-ui/core/Badge"
import { Typography } from "@material-ui/core"

export const GRADES = {
  g: {
    text: "전체관람가",
    color: "green",
  },
  "12": {
    text: "12세 관람가",
    color: "orange",
  },
  "15": {
    text: "15세 관람가",
    color: "cyan",
  },
  "19": {
    text: "청소년 관람불가",
    color: "red",
  },
  gv: {
    text: "게스트와의 만남",
    color: "lime",
  },
  ke: {
    text: "한글자막+영어자막/대사",
    color: "geekblue",
  },
  kk: {
    text: "시·청각장애인을 위한 배리어프리자막상영",
    color: "purple",
  },
}

export const GradeList = () => (
  <div style={{ marginBottom: `1rem` }}>
    {Object.keys(GRADES).map(g => {
      return (
        <Badge
          key={g}
          color="primary"
          style={{ marginRight: `0.75rem` }}
        >
          <Typography variant="overline">{GRADES[g].text}</Typography>
        </Badge>
      )
    })}
  </div>
)

const Grade = ({ level }) => {
  return <Badge variant="dot" color="primary" />
}

export default Grade
