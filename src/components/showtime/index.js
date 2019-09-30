import React from "react"

import Popper from "@material-ui/core/Popper"
import Typography from "@material-ui/core/Typography"

import Grade from "../grade"
import Description from "./description"

import style from "./index.module.css"


const TIME_HEIGHT = 5
const THEATER_HEIGHT = 6
const GUTTER = 1.5

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
  const [ anchorEl, setAnchorEl ] = React.useState(null)

  const [hour, minute] = show.time.split(":").map(Number)

  const totalLength = getProgramsTotalLength(show.programs)

  const top = calculateTop(hour, minute)
  const height = calculateHeight(totalLength)

  const [endHour, endMinute] = calculteEndTime(hour, minute, totalLength)
  const endHourStr = endHour < 10 ? `0${endHour}` : `${endHour}`
  const endMinuteStr = endMinute < 10 ? `0${endMinute}` : `${endMinute}`

  const handleDescriptionOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDescriptionClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div>
      <div
        aria-owns={open ? "showtime-popper" : undefined}
        aria-haspopup="true"
        className={style.screen}
        onMouseEnter={handleDescriptionOpen}
        onMouseLeave={handleDescriptionClose}
        style={{
          top: `${top}rem`,
          height: `${height}rem`,
        }}
      >
        <div>
          <Typography variant="overline">
            {show.time}~{endHourStr}:{endMinuteStr}
          </Typography>
          <Typography variant="subtitle2">{show.title}</Typography>
          {show.programs.length === 1 && (
            <div>
              <Typography variant="caption">{show.programs[0].titleEng}</Typography>
            </div>
          )}
          {show.programs.length > 1 && (
            <ul>
              {show.programs.map(program => (
                <li key={program.title}>
                  <Typography variant="caption">{program.title}</Typography>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {show.grades.map(grade => (
            <Grade key={`${show.time}-${show.titme}-${grade}`} level={grade} />
          ))}
        </div>
      </div>
      <Popper
        id="showtime-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={handleDescriptionClose}
        style={{ zIndex: 2 }}
      >
        <Description programs={show.programs} />
      </Popper>
    </div>
  )
}

export default Showtime
