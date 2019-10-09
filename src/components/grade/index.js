import React from "react"
import { Typography } from "antd"

const { Text } = Typography

export const GRADES = {
  g: {
    text: "전체관람가",
  },
  "12": {
    text: "12세 관람가",
  },
  "15": {
    text: "15세 관람가",
  },
  "19": {
    text: "청소년 관람불가",
  },
  gv: {
    text: "게스트와의 만남",
  },
  ke: {
    text: "한글자막+영어자막/대사",
  },
  kk: {
    text: "시·청각장애인을 위한 배리어프리자막상영",
  },
}

export const GradeInfo = () => (
  <div style={{ display: `inline-block`, marginBottom: `0.4rem` }}>
    {Object.keys(GRADES).map(g => (
      <div key={g} style={{ float: `left`, marginRight: `0.85rem` }}>
        <Text className="grade-info-typography"><strong>/ {g} /</strong> {GRADES[g].text}</Text>
      </div>)
    )}
  </div>
)

const Grade = ({ level }) => {
  return (
    <Text strong className="typography">
      {`/ ${level}`}
    </Text>
  )
}

export default Grade
