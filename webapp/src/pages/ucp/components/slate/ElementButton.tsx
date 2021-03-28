import * as React from "react";
import {IconButton, SvgIconTypeMap, Theme} from "@material-ui/core";
import {useSlate} from "slate-react";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx"
import {ReactNode} from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#ccc',
    cursor: 'pointer',
  },
  active: {
    color: 'black'
  },
}))

type Props = {
  format: string
  children: ReactNode
}

const ElementButton = ({ format, children }: Props) => {
  const classes = useStyles()

  const editor = useSlate()
  return (
    <span>
      {children}
    </span>
  )
}

export default ElementButton