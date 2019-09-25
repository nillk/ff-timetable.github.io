import React from "react"

import style from "./index.module.css"

const Theater = ({ name }) => (
    <div className={style.theater}>
      {name}
    </div>
);

export default Theater;