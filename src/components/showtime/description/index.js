import React from 'react';
import { Typography, Tag, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const GenreContainer = info => {
  if (info && info.genre) {
    return (
      <div className="genre-container">
        {info.genre.map(g => (
          <Tag key={g} className="genre">
            {g}
          </Tag>
        ))}
      </div>
    );
  }

  return <></>;
};

const Description = ({ programs, onClose }) => {
  return (
    <div className="description">
      <Button
        icon={<CloseOutlined />}
        size="small"
        type="link"
        aria-label="close"
        className="close"
        onClick={onClose}></Button>
      {programs.map(program => (
        <Typography key={program.titleEng} className="program">
          <Paragraph className="title">
            {program.title}
            <Text type="secondary" className="title-eng">
              {' '}
              {program.titleEng}
            </Text>
          </Paragraph>
          {program.info && (
            <Paragraph className="info">
              {Object.keys(program.info)
                .filter(key => key !== 'genre')
                .filter(key => program.info[key])
                .map(key => (
                  <span key={key}>{program.info[key]}</span>
                ))}
            </Paragraph>
          )}
          {GenreContainer(program.info)}
          <Paragraph className="desc">{program.desc}</Paragraph>
        </Typography>
      ))}
    </div>
  );
};

export default Description;
