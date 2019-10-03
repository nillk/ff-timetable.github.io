import React from "react"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"

const GenreTags = info => {
  if (info !== null && info.genre !== null) {
    return (
      <div style={{ marginTop: `0.75rem` }}>
        {info.genre.map(g => (
          <Chip size="small" label={g} style={{
            marginRight: `0.25rem`,
            height: `1.2rem`,
            fontSize: `0.75rem`
          }} />
        ))}
      </div>
    )
  }

  return <></>
}

const Description = ({ programs }) => {
  return (
    <Paper style={{
      padding: `0.125rem 1rem 1.25rem 1rem`,
      minWidth: `15rem`,
      maxWidth: `30rem`,
      backgroundColor: `white`,
      wordBreak: `keep-all`
    }}>
      {programs.map(program => {
        return (
          <div>
            <Typography variant="subtitle1" style={{ marginTop: `0.875rem` }}>
              {program.title}
              <Typography variant="caption" style={{ fontStyle: `italic`, color: `dimgray` }}>
                {" "}
                {program.titleEng}
              </Typography>
            </Typography>
            {GenreTags(program.info)}
            <Typography variant="body2" style={{ marginTop: `0.75rem` }}>
              {program.desc}
            </Typography>
          </div>
        )
      })}
    </Paper>
  )
}

export default Description
