import React from 'react';
import { graphql } from 'gatsby';
import { Typography } from 'antd';
import { Row, Col } from 'antd';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { FilterConsumer } from '../context/filter-context';

import { showScreen, showTime } from '../utils';

import Page from '../components/layout';
import Theater from '../components/theater';
import Showtime from '../components/showtime';
import Filter from '../components/filter';
import { GradeInfo } from '../components/grade';

export default ({ data }) => {
  const [visible, setVisible] = React.useState(false);

  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const { schedule } = data;

  const dayFirstScreenTime = schedule.screening.reduce((min, screen) => {
    const [hour, minute] = screen.times[0].time.split(':').map(Number);
    return hour < min[0] || (hour === min[0] && minute < min[1]) ? [hour, minute] : min;
  }, [23, 59]);

  return (
    <FilterConsumer>
      {({ state, actions }) => (
        <Page name={schedule.name} year={schedule.year}>
          <Row>
            <Col>
              <Typography.Title
                level={2}
                style={{
                  fontWeight: `lighter`,
                  marginBottom: `1.25rem`,
                  float: `left`,
                }}>
                {schedule.dateStr}
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
              <Filter
                visible={visible}
                onClose={closeDrawer}
                screening={schedule.screening}
                state={state}
                actions={actions}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <GradeInfo screening={schedule.screening} />
            </Col>
          </Row>
          <Row
            type="flex"
            justify="start"
            gutter={16}
            style={{ flexFlow: `row` }}>
            {schedule.screening.map(
              screen =>
                showScreen(state, screen) && (
                  <Col key={screen.theater} style={{ position: `relative` }}>
                    <Theater name={screen.theater} />
                    {screen.times.map(
                      time =>
                        showTime(state, time) && (
                          <Showtime
                            key={`${screen.theater}-${time.time}`}
                            show={time}
                            firstScreenTime={dayFirstScreenTime}
                          />
                        ),
                    )}
                  </Col>
                ),
            )}
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
          code
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
