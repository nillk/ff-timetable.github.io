import React from 'react';
import { graphql } from 'gatsby';
import { Typography } from 'antd';
import { Row, Col } from 'antd';
import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { FilterConsumer } from '../context/filter-context';

import Page from '../components/layout';
import Theater from '../components/theater';
import Showtime from '../components/showtime';
import Filter from '../components/filter';
import { GradeInfo } from '../components/grade';

const getAllDistinctGrades = screening => {
  const allGenres = screening.flatMap(screen =>
    screen.times.flatMap(time => time.grades.map(g => g.toUpperCase())),
  );
  return [...new Set(allGenres)].sort();
};

const getGenresOfPrograms = programs =>
  programs
    .filter(program => program.info && program.info.genre)
    .flatMap(program => program.info.genre);

const getGenresOfScreen = screen =>
  screen.times
    .filter(time => time.programs)
    .flatMap(time => getGenresOfPrograms(time.programs));

const getAllDistinctGenres = screening => {
  const allGenres = screening.flatMap(getGenresOfScreen);
  return [...new Set(allGenres)].sort();
};

const showScreen = (genre, screen) =>
  genre.length === 0 || getGenresOfScreen(screen).some(g => genre.includes(g));

const showTime = (genre, time) =>
  genre.length === 0 ||
  getGenresOfPrograms(time.programs).some(g => genre.includes(g));

export default ({ data }) => {
  const allGrades = getAllDistinctGrades(data.schedule.screening);
  const allGenres = getAllDistinctGenres(data.schedule.screening);

  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  return (
    <FilterConsumer>
      {({ state, actions }) => (
        <Page name={data.schedule.name} year={data.schedule.year}>
          <Row>
            <Col>
              <Typography.Title
                level={2}
                style={{
                  fontWeight: `lighter`,
                  marginBottom: `1.25rem`,
                  float: `left`,
                }}>
                {data.schedule.dateStr}
              </Typography.Title>
            </Col>
            <Col>
              <Button
                icon={<FilterOutlined />}
                aria-label="filter"
                size="large"
                type="link"
                onClick={showDrawer}
                style={{ color: `rgba(0, 0, 0, 0.85)` }}
              />
              <Drawer title="Filter" onClose={closeDrawer} visible={visible}>
                <Filter genres={allGenres} state={state} actions={actions} />
              </Drawer>
            </Col>
          </Row>
          <Row>
            <Col>
              <GradeInfo grades={allGrades} />
            </Col>
          </Row>
          <Row
            type="flex"
            justify="start"
            gutter={16}
            style={{ flexFlow: `row` }}>
            {data.schedule.screening.map(screen => {
              return showScreen(state.genre, screen) ? (
                <Col key={screen.theater} style={{ position: `relative` }}>
                  <Theater name={screen.theater} />
                  {screen.times.map(time => {
                    return showTime(state.genre, time) ? (
                      <Showtime
                        key={`${screen.theater}-${time.time}`}
                        show={time}
                      />
                    ) : (
                      <></>
                    );
                  })}
                </Col>
              ) : (
                <></>
              );
            })}
          </Row>
        </Page>
      )}
    </FilterConsumer>
  );
};

export const query = graphql`
  query($name: String!, $year: Int!, $date: String!) {
    schedule(name: { eq: $name }, year: { eq: $year }, date: { eq: $date }) {
      name
      year
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
              color
              genre
            }
            credit {
              director
              cast
            }
          }
        }
      }
    }
  }
`;
