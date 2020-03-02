import React from 'react';
import { Select } from 'antd';

export default ({ genres, state, actions }) => {
  const { genre } = state;
  const { setGenre } = actions;

  return (
    <Select
      showSearch
      mode="tags"
      size="small"
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
  );
};
