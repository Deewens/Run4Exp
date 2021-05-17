import * as React from 'react'

type Props = {
  name?: string
}

export default function Hello(props: Props) {
  const {
    name
  } = props

  if (name) {
    return <h1>Hello, {name}!</h1>
  } else {
    return <span>Hey, stranger</span>
  }
}