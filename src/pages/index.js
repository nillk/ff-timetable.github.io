import React from "react";
import { graphql, Link } from "gatsby";
import { Typography } from "antd";
import { VideoCameraOutlined } from '@ant-design/icons';

import Page from "../components/layout";

const { Title, Paragraph } = Typography;

export default ({ data }) => {
  const ffInfo = data.allSchedule.group.reduce((acc, curr) => {
    const name = curr.fieldValue;
    const firstSlugOfYear = curr.nodes.reduce((acc, curr) => {
      if (!(curr.year in acc)) {
        acc[curr.year] = curr.fields.slug;
      }
      return acc;
    }, {});

    return [...acc, {name, years: firstSlugOfYear }];
  }, []);

  return (
    <Page>
      <Typography>
        <Title>
          <VideoCameraOutlined /> Film Festival Timetable
        </Title>
        <Paragraph>
          <ul>
            {ffInfo.map(ff => {
              return Object.keys(ff.years).map(year => (
                <li key={`/${ff.name}/${year}`}>
                  <Link to={ff.years[year]}>
                    {ff.name.toUpperCase()} {year}
                  </Link>
                </li>
              ))
            })}
          </ul>
        </Paragraph>
      </Typography>
    </Page>
  )
}

export const query = graphql`
  query {
    allSchedule(sort: {fields: date}) {
      group(field: name) {
        fieldValue
        nodes {
          year
          fields {
            slug
          }
        }
      }
    }
  }
`