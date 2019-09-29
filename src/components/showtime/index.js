import React from "react"
import { Typography, Popover } from "antd"

import Grade from "../grade"
import Description from "./description"

import style from "./index.module.css"

const { Paragraph, Text } = Typography

const TIME_HEIGHT = 90
const THEATER_HEIGHT = 116
const GUTTER = 16

const calculateTop = (hour, minute) => {
  const hourDiff = hour - 10 // start time is 10:00
  const minuteDiff = minute / 60

  return (hourDiff + minuteDiff) * TIME_HEIGHT + THEATER_HEIGHT + GUTTER
}

const calculateHeight = length => (length / 60) * TIME_HEIGHT

const calculteEndTime = (hour, minute, totalLength) => [
  hour + Math.floor(totalLength / 60),
  minute + (totalLength % 60),
]

const getProgramsTotalLength = programs =>
  programs.reduce((acc, program) => acc + getLength(program), 0)

const getLength = program =>
  program.info !== null ? Number(program.info.length.replace("min", "")) : 0

const Showtime = ({ show }) => {
  const [hour, minute] = show.time.split(":").map(Number)

  const totalLength = getProgramsTotalLength(show.programs)

  const top = calculateTop(hour, minute)
  const height = calculateHeight(totalLength)

  const [endHour, endMinute] = calculteEndTime(hour, minute, totalLength)
  const endHourStr = endHour < 10 ? `0${endHour}` : `${endHour}`
  const endMinuteStr = endMinute < 10 ? `0${endMinute}` : `${endMinute}`

  return (
    <Popover
      placement="bottom"
      content={<Description programs={show.programs} />}
    >
      <div
        className={style.screen}
        style={{
          top: `${top}px`,
          height: `${height}px`,
        }}
      >
        <Typography>
          <Text strong>
            {show.time}~{endHourStr}:{endMinuteStr}
          </Text>
          <Paragraph>
            <Text>{show.title}</Text>
            {show.programs.length === 1 && (
              <div>
                <Text type="secondary">{show.programs[0].titleEng}</Text>
              </div>
            )}
            {show.programs.length > 1 && (
              <ul>
                {show.programs.map(program => (
                  <li key={program.title}>
                    <Text type="secondary">{program.title}</Text>
                  </li>
                ))}
              </ul>
            )}
          </Paragraph>
        </Typography>
        <div>
          {show.grades.map(grade => (
            <Grade key={`${show.time}-${show.titme}-${grade}`} level={grade} />
          ))}
        </div>
      </div>
    </Popover>
  )
}

export default Showtime
