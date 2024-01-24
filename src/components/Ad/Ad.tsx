import React from "react";

interface props {
  src: string[]
}

export const Ad = (props) => {
  return (
    <img src={props.src[0]}></img>
  )
}