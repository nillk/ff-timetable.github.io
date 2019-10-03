import React from "react"

import { Typography } from "@material-ui/core"

export const GRADES = {
  g: {
    text: "전체관람가",
    color: "#364f6b",
  },
  "12": {
    text: "12세 관람가",
    color: "#364f6b",
  },
  "15": {
    text: "15세 관람가",
    color: "#364f6b",
  },
  "19": {
    text: "청소년 관람불가",
    color: "#364f6b",
  },
  gv: {
    text: "게스트와의 만남",
    color: "#fc5185",
  },
  ke: {
    text: "한글자막+영어자막/대사",
    color: "#3fc1c9",
  },
  kk: {
    text: "시·청각장애인을 위한 배리어프리자막상영",
    color: "#3fc1c9",
  },
}

const Grade = ({ level }) => {
  return (
    <Typography
      style={{
        float: `right`,
        marginLeft: `0.2rem`,
        fontSize: `0.7rem`,
        fontWeight: 600
      }}
    >
      {`/ ${level.toUpperCase()}`}
    </Typography>
  )
}

export default Grade
