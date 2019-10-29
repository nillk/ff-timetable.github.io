import React from "react"
import { graphql } from "gatsby"
import { Typography } from "antd"
import { Row, Col } from "antd"
import { Button, Drawer } from "antd"

import Page from "../components/layout"
import Theater from "../components/theater"
import Showtime from "../components/showtime"
import Filter from "../components/filter"
import { GradeInfo } from "../components/grade"

const getGenresOfScreen = screen => {
  return screen.times
    .filter(time => time && time.programs)
    .flatMap(time =>
      time.programs
        .filter(program => program && program.info && program.info.genre)
        .flatMap(program => program.info.genre)
    )
}

const getAllDistinctGenres = screening => {
  const allGenres = screening.flatMap(screen => getGenresOfScreen(screen))
  return [...new Set(allGenres)]
}

const containsGenre = (genre, screen) => {
  return getGenresOfScreen(screen).some(g => genre.includes(g))
}

export default ({ data }) => {
  const allGenres = getAllDistinctGenres(data.biffJson.screening)

  const [genre, setGenre] = React.useState([])
  const [visible, setVisible] = React.useState(false)

  const handleGenreFilter = value => {
    setGenre(value)
  }

  const showDrawer = () => setVisible(true)
  const closeDrawer = () => setVisible(false)

  return (
    <Page>
      <Row>
        <Col>
          <Typography.Title
            level={2}
            style={{
              fontWeight: `lighter`,
              marginBottom: `1.25rem`,
              float: `left`,
            }}
          >
            {data.biffJson.dateStr}
          </Typography.Title>
        </Col>
        <Col>
          <Button
            icon="filter"
            aria-label="filter"
            size="large"
            type="link"
            onClick={showDrawer}
            style={{ color: `rgba(0, 0, 0, 0.85)` }}
          />
          <Drawer title="Filter" onClose={closeDrawer} visible={visible}>
            <Filter
              label={`Genre`}
              value={allGenres}
              onChange={handleGenreFilter}
            />
          </Drawer>
        </Col>
      </Row>
      <Row>
        <Col><GradeInfo /></Col>
      </Row>
      <Row type="flex" justify="start" gutter={16} style={{ flexFlow: `row` }}>
        {data.biffJson.screening.map(screen => {
          return genre.length > 0 && !containsGenre(genre, screen) ? null : (
            <Col key={screen.theater} style={{ position: `relative` }}>
              <Theater name={screen.theater} />
              {screen.times.map(time => (
                <Showtime
                  key={`${screen.theater}-${time.time}`}
                  show={time}
                  genre={genre}
                />
              ))}
            </Col>
          )
        })}
      </Row>
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
