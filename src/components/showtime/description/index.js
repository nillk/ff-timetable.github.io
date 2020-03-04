import React from 'react';
import { Typography, Tag, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const ProgramTitle = ({ title, titleEng }) => (
  <Paragraph className="title">
    {title}
    <Text type="secondary" className="title-eng">
      {' '}
      {titleEng}
    </Text>
  </Paragraph>
);

const ProgramInfo = ({ info }) => (
  <Paragraph className="info">
    {Object.keys(info)
      .filter(key => key !== 'genre' && info[key])
      .map(key => (
        <span key={key}>
          {Array.isArray(info[key])
            ? info[key].map(i => <span>{i}</span>)
            : info[key]}
        </span>
      ))}
  </Paragraph>
);

const ProgramCredit = ({ credit }) => (
  <ul className="credit">
    {Object.keys(credit)
      .filter(key => credit[key])
      .map(key => (
        <li>
          {key[0].toUpperCase() + key.substring(1)}{' '}
          {Array.isArray(credit[key]) ? (
            credit[key].map(c => <span>{c}</span>)
          ) : (
            <span>{credit[key]}</span>
          )}
        </li>
      ))}
  </ul>
);

const ProgramGenre = ({ genre }) => (
  <div className="genre">
    {genre.map(g => (
      <Tag key={g} className="genre-tag">
        {g}
      </Tag>
    ))}
  </div>
);

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
          <ProgramTitle title={program.title} titleEng={program.titleEng} />
          {program.info && <ProgramInfo info={program.info} />}
          {program.credit && <ProgramCredit credit={program.credit} />}
          {program.info && program.info.genre && (
            <ProgramGenre genre={program.info.genre} />
          )}
          <Paragraph className="desc">{program.desc}</Paragraph>
        </Typography>
      ))}
    </div>
  );
};

export default Description;
