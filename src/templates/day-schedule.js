import React from 'react';
import { graphql } from 'gatsby';
import { Typography } from 'antd';
import { Row, Col } from 'antd';
import { Button, Drawer } from 'antd';
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
                <Filter
                  screening={data.schedule.screening}
                  state={state}
                  actions={actions}
                />
              </Drawer>
            </Col>
          </Row>
          <Row>
            <Col>
              <GradeInfo screening={data.schedule.screening} />
            </Col>
          </Row>
          <Row
            type="flex"
            justify="start"
            gutter={16}
            style={{ flexFlow: `row` }}>
            {data.schedule.screening.map(
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
