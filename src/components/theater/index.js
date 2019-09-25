import React from "react"

import style from "./index.module.css"

const addSpaceAfterBrandName = (name) => {
  const check = /(CGV|메가박스|롯데시네마)(?!\s)/.exec(name)

  if (check !== null) {
    const length = check[0].length
    const index = check["index"]

    return name.slice(0, length + index) + " " + name.slice(length + index)
  }

  return name
}

const Theater = ({ name }) => (
    <div className={style.theater}>
      {addSpaceAfterBrandName(name)}
    </div>
);

export default Theater;