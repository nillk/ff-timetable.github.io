import React from "react"
import { graphql } from "gatsby"

import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

import Page from "../components/layout"

import Theater from "../components/theater"
import Showtime from "../components/showtime"

import Filter from "../components/filter"
import { GradeInfo } from "../components/grade"

const getGenresOfScreen = (screen) => {
  return screen.times.filter(time => time && time.programs)
    .flatMap(time => time.programs
      .filter(program => program && program.info && program.info.genre)
      .flatMap(program => program.info.genre))
}

const getAllDistinctGenres = (screening) => {
  const allGenres = screening.flatMap(screen => getGenresOfScreen(screen))
  return [...new Set(allGenres)]
}

const containsGenre = (genre, screen) => {
  return getGenresOfScreen(screen).some(g => genre.includes(g))
}

export default ({ data }) => {
  const allGenres = getAllDistinctGenres(data.biffJson.screening)

  const [ genre, setGenre ] = React.useState([])

  const handleGenreFilter = value => {
    setGenre(value)
  }

  return (
    <Page>
      <Typography
        variant="h4"
        style={{
          fontWeight: `lighter`,
          marginTop: `0.5rem`,
          marginBottom: `1.25rem`
        }}
      >
        {data.biffJson.dateStr}
      </Typography>
      <Filter
        label={`Genre`}
        value={allGenres}
        onChange={(value) => handleGenreFilter(value)} />
      <GradeInfo />
      <Grid container spacing={2} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(screen => {
          return (genre.length > 0 && !containsGenre(genre, screen)) ?
            null
            :
            (<Grid item key={screen.theater} style={{ position: `relative` }}>
              <Theater name={screen.theater} />
              {screen.times.map(time => (
                <Showtime
                  key={`${screen.theater}-${time.time}`}
                  show={time}
                  genre={genre} />
              ))}
            </Grid>)
          }
        )}
      </Grid>
    </Page>
  )
}

export const query = graphql`
  query($date: String!) {
    biffJson(date: { eq: $date }) {
      date
      dateStr
      screening {
        theater
        times {
          time
          title
          grades
          programs {
            title
            titleEng
            desc
            info {
              productionCountry
              yearOfProduction
              length
              genre
            }
          }
        }
      }
    }
  }
`
