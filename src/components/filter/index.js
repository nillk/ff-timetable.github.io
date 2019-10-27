import React from "react"
import { Select } from "antd"

export default ({ label, value, onChange }) => (
  <Select
    showSearch
    mode="tags"
    size="small"
    placeholder={label}
    onChange={onChange}
    style={{ width: `13rem` }}
  >
    {value.map(v => (
      <Select.Option key={v} value={v}>{v}</Select.Option>
    ))}
  </Select>
)