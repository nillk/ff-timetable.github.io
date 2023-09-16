import React from 'react';
import { Drawer, Tooltip, Button } from 'antd';
import { Row, Col, Select } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

import { getAllDistinctData } from '../../utils';

export default ({ visible, onClose, screening, state, actions }) => {
  const { setData, clear } = actions;

  return (
    <Drawer
      title={
        <div>
          Filter
          <Tooltip title="Clear">
            <Button type="link" icon={<ClearOutlined />} onClick={clear} />
          </Tooltip>
        </div>
      }
      onClose={onClose}
      visible={visible}>
      <Row gutter={[8, 8]}>
        {Object.keys(state).map(key => (
          <Col span={24} key={key}>
            <Select
              showSearch
              mode="tags"
              placeholder={key[0].toUpperCase() + key.substring(1)}
              value={state[key]}
              onChange={setData(key)}
              style={{ width: `20.5rem` }}>
              {getAllDistinctData(key, screening).map(v => (
                <Select.Option key={v} value={v}>
                  {v}
                </Select.Option>
              ))}
            </Select>
          </Col>
        ))}
      </Row>
    </Drawer>
  );
};
