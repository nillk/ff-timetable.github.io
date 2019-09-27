import React from "react"
import { Typography, Tag } from 'antd'

const { Title, Paragraph, Text } = Typography

const GenreTags = (info) => {
  if (info !== null && info.genre !== null) {
    return (<Paragraph>
      {info.genre.map(g => (
        <Tag color="#00c8f8" style={{ marginRight: 4 }}>{g}</Tag>
      ))}
    </Paragraph>)
  }

  return <></>;
}

const Description = ({ programs }) => {
  return (
    <div style={{ minWidth: 240, maxWidth: 480, wordBreak: `keep-all` }}>
      <Typography>
        {programs.map(program => {
          return (
            <>
              <Title level={4}>
                {program.title}
                <Text type="seconday" style={{ fontSize: 16 }}> {program.titleEng}</Text>
              </Title>
              {GenreTags(program.info)}
              <Paragraph>{program.desc}</Paragraph>
            </>);
        })}
      </Typography>
    </div>
  );
};

export default Description;