import React from "react"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"

const GenreTags = info => {
  if (info !== null && info.genre !== null) {
    return (
      <div style={{ marginTop: `0.75rem` }}>
        {info.genre.map(g => (
          <Chip size="small" color="secondary" label={g} style={{ marginRight: `0.25rem` }} />
        ))}
      </div>
    )
  }

  return <></>
}

const Description = ({ programs }) => {
  return (
    <Paper style={{ padding: `1rem`, minWidth: `15rem`, maxWidth: `30rem`, backgroundColor: `#FFFFFF`, wordBreak: `keep-all` }}>
      {programs.map(program => {
        return (
          <div>
            <Typography variant="subtitle1">
              {program.title}
              <Typography variant="caption">
                {" "}
                {program.titleEng}
              </Typography>
            </Typography>
            {GenreTags(program.info)}
            <div style={{ marginTop: `0.75rem` }}>{program.desc}</div>
          </div>
        )
      })}
    </Paper>
  )
}

export default Description
