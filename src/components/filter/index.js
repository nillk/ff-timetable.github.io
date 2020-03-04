import React from 'react';
import { Row, Col, Select } from 'antd';
import { getAllDistinctDirectors, getAllDistinctGenres } from '../../utils';

export default ({ screening, state, actions }) => {
  const directors = getAllDistinctDirectors(screening);
  const genres = getAllDistinctGenres(screening);

  const { director, genre } = state;
  const { setDirector, setGenre } = actions;

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Select
          showSearch
          mode="tags"
          placeholder="Director"
          value={director}
          onChange={setDirector}
          style={{ width: `13rem` }}>
          {directors.map(v => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={24}>
        <Select
          showSearch
          mode="tags"
          placeholder="Genre"
          value={genre}
          onChange={setGenre}
          style={{ width: `13rem` }}>
          {genres.map(v => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};
