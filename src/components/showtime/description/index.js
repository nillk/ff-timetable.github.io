import React from "react"
import { Typography, Tag, Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"

const { Paragraph, Text } = Typography

const GenreTags = info => {
  if (info !== null && info.genre !== null) {
    return (
      <div style={{ marginBottom: `0.875rem` }}>
        {info.genre.map(g => (
          <Tag
            key={g}
            style={{
              lineHeight: `1rem`,
              padding: `0 0.3rem`,
              marginRight: `0.25rem`,
            }}
          >
            {g}
          </Tag>
        ))}
      </div>
    )
  }

  return <></>
}

const Description = ({ programs, onClose }) => {
  return (
    <div className="description">
      <Button
        icon={<CloseOutlined />}
        aria-label="close"
        size="small"
        type="link"
        style={{
          float: `right`,
          color: `rgba(0, 0, 0, 0.87)`,
        }}
        onClick={onClose}
      ></Button>
      {programs.map(program => (
        <Typography key={program.titleEng}>
          <Paragraph style={{ fontSize: `1rem`, marginBottom: `0.3rem` }}>
            {program.title}
            <Text
              type="secondary"
              style={{ fontStyle: `italic`, fontWeight: 300 }}
            >
              {" "}
              {program.titleEng}
            </Text>
          </Paragraph>
          {program.info &&
            (program.info.productionCountry ||
              program.info.yearOfProduction) && (
              <Paragraph>
                <ul>
                  <li style={{ fontSize: `0.78rem` }}>
                    {program.info.productionCountry}/
                    {program.info.yearOfProduction}
                  </li>
                </ul>
              </Paragraph>
            )}
          {GenreTags(program.info)}
          <Paragraph style={{ fontSize: `0.825rem` }}>{program.desc}</Paragraph>
        </Typography>
      ))}
    </div>
  )
}

export default Description
