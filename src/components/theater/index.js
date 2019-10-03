import React from "react"

import { BOX_SIZE } from "../constants"

const addSpaceAfterBrandName = name => {
  const check = /(CGV|메가박스|롯데시네마)(?!\s)/.exec(name)

  if (check !== null) {
    const length = check[0].length
    const index = check["index"]

    return name.slice(0, length + index) + " " + name.slice(length + index)
  }

  return name
}

const Theater = ({ name }) => (
  <div style={{
    padding: `0.5rem`,
    height: `${BOX_SIZE}rem`,
    width: `${BOX_SIZE}rem`,
    backgroundColor: `black`,
    color: `white`,
    fontSize: `0.875rem`,
    fontWeight: 600,
    wordBreak: `keep-all`
  }}>
    {addSpaceAfterBrandName(name)}
  </div>
)

export default Theater
