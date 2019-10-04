import React from "react"

import Popper from "@material-ui/core/Popper"
import Typography from "@material-ui/core/Typography"

import { BOX_SIZE } from "../constants"

import Grade from "../grade"
import Description from "./description"


const TIME_HEIGHT = 6
const GUTTER = 2

const calculateTop = (hour, minute) => {
  const hourDiff = hour - 10 // start time is 10:00
  const minuteDiff = minute / 60

  return (hourDiff + minuteDiff) * TIME_HEIGHT + BOX_SIZE + GUTTER
}

const calculateHeight = length => (length / 60) * TIME_HEIGHT

const calculteEndTime = (hour, minute, totalLength) => {
  const calculteHour = (minute) => Math.floor(minute / 60)

  const endMinute = minute + (totalLength % 60)

  return [
    hour + calculteHour(totalLength) + calculteHour(endMinute),
    endMinute % 60
  ]
}

const getProgramsTotalLength = programs =>
  programs.reduce((acc, program) => acc + getLength(program), 0)

const getLength = program =>
  program.info !== null ? Number(program.info.length.replace("min", "")) : 0

const Showtime = ({ show }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

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
  const popperId = `${show.time}-${show.title}`

  return (
    <div
      aria-owns={open ? popperId : undefined}
      aria-haspopup={true}
      onMouseEnter={handleDescriptionOpen}
      onMouseLeave={handleDescriptionClose}
      style={{
        position: `absolute`,
        top: `${top}rem`,
        height: `${height}rem`,
        padding: `0rem 0.5rem`,
        width: `${BOX_SIZE}rem`,
        minHeight: `${BOX_SIZE}rem`,
        borderTop: `0.25rem solid black`,
        borderBottom: `0.25rem solid lightgray`,
        fontSize: `0.75rem`,
        wordBreak: `keep-all`,
        marginBottom: `2rem`
      }}
    >
      <div>
        <Typography variant="overline" style={{ fontWeight: 600 }}>
          {show.time}~{endHourStr}:{endMinuteStr}
        </Typography>
        <Typography variant="subtitle2">{show.title}</Typography>
        {show.programs.length === 1 && (
          <Typography
            variant="caption"
            style={{
              fontStyle: `italic`,
              color: `dimgray`
            }}
          >
            {show.programs[0].titleEng}
          </Typography>
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
      <div
        style={{
          position: `absolute`,
          top: `-1.6rem`,
          right: 0,
          width: `100%`
        }}
      >
        {show.grades.map(grade => (
          <Grade key={`${show.time}-${show.titme}-${grade}`} level={grade} />
        ))}
      </div>
      <Popper
        id={popperId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleDescriptionClose}
        style={{ zIndex: 2 }}
      >
        <Description
          programs={show.programs}
          onClose={handleDescriptionClose} />
      </Popper>
    </div>
  )
}

export default Showtime
