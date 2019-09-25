import React from "react"
import { Typography, Popover } from "antd"

import Description from "./description"

import style from "./index.module.css"

const { Paragraph, Text } = Typography

const TIME_HEIGHT = 75
const THEATER_HEIGHT = 92
const GUTTER = 16

const calculateTop = time => {
  const [hour, minute] = time.split(":").map(Number)
  const hourDiff = hour - 10 // start time is 10:00
  const minuteDiff = minute / 60

  return ((hourDiff + minuteDiff) * TIME_HEIGHT) + THEATER_HEIGHT + GUTTER
}

const calculateHeight = programs => {
  const totalLength = programs.reduce((acc, program) => {
    const length =
      program.info !== null ? Number(program.info.length.replace("min", "")) : 0

    return acc + length
  }, 0)

  return (totalLength / 60) * TIME_HEIGHT
}

const Showtime = ({ time }) => (
  <Popover placement="bottom" content={<Description programs={time.programs} />}>
    <div
      className={style.screen}
      style={{
        top: `${calculateTop(time.time)}px`,
        height: `${calculateHeight(time.programs)}px`,
      }}
    >
      <Typography>
        <Text strong>{time.time}</Text>
        <Paragraph>
          {time.title}
        </Paragraph>
      </Typography>
    </div>
  </Popover>
);

export default Showtime;