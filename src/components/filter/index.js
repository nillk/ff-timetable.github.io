import React from "react"
import { Select } from "antd"

const { Option } = Select

export default ({ label, value, onChange }) => (
  <Select
    showSearch
    mode="tags"
    size="small"
    placeholder={label}
    onChange={onChange}
    style={{ width: `8rem` }}
  >
    {value.map(v => (
      <Option key={v} value={v}>{v}</Option>
    ))}
  </Select>
)