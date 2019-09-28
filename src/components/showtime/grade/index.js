import React from "react"
import { Badge } from "antd"

export const GRADES = {
  "g": {
    "text": "전체관람가",
    "color": "green"
  },
  "12": {
    "text": "12세 관람가",
    "color": "orange"
  },
  "15": {
    "text": "15세 관람가",
    "color": "cyan"
  },
  "19": {
    "text": "청소년 관람불가",
    "color": "red"
  },
  "ke": {
    "text": "한글자막+영어자막/대사",
    "color": "geekblue"
  },
  "gv": {
    "text": "게스트와의 만남",
    "color": "lime"
  },
  "kk": {
    "text": "시·청각장애인을 위한 배리어프리자막상영",
    "color": "purple"
  }
}

const Grade = ({ level }) => {
  return <Badge color={GRADES[level].color} />
}

export default Grade
