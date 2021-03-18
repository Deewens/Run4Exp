import * as React from "react";
import {IconButton, Theme} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {useSlate} from "slate-react";

const useStyles = makeStyles((theme: Theme) => ({
  active: {
    backgroundColor: 'black'
  }
}))

type Props = {
  format: string
  icon: React.ReactNode
}

const MarkButton = ({ format, icon }: Props) => {
  const classes = useStyles()
  const editor = useSlate()
  return (
    <IconButton
      onMouseDown={event => {
        event.preventDefault()
      }}
    >
      {icon}
    </IconButton>
  )
}

export default MarkButton