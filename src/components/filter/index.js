import React from 'react';
import { Row, Col, Select } from 'antd';
import { getAllDistinctData } from '../../utils';

export default ({ screening, state, actions }) => {
  const { setData } = actions;

  return (
    <Row gutter={[8, 8]}>
      {Object.keys(state).map(key => (
        <Col span={24} key={key}>
          <Select
            showSearch
            mode="tags"
            placeholder={key[0].toUpperCase() + key.substring(1)}
            value={state[key]}
            onChange={setData(key)}
            style={{ width: `13rem` }}>
            {getAllDistinctData(key, screening).map(v => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </Col>
      ))}
    </Row>
  );
};
