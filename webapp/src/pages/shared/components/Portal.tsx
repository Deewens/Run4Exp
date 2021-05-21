import React from 'react'
import ReactDOM from 'react-dom'
import {useEffect, useState} from "react";

type Props = {
  children: React.ReactNode,
  className?: string
  el?: string
}

export const Portal = (props: Props) => {
  const {
    children,
    className = 'root-portal',
    el = 'div',
  } = props
  const [container] = useState(document.createElement(el))

  container.classList.add(className)

  useEffect(() => {
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return ReactDOM.createPortal(children, container)
}