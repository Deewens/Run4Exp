import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    textAlign: 'center',
    overflow: 'hidden',
    margin: '0',
    borderBottom: '1px solid #ccc',
    cursor: 'pointer',
    color: 'black',
    textDecoration: 'none',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#F4F4F4',
    },
    '&:first-of-type': {
      borderTop: '2px solid gray',
    },
    '&:last-of-type': {
      borderBottom: '2px solid gray',
    },
    borderRight: '2px solid gray',
    borderLeft: '2px solid gray',
    boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)'
  },
  active: {
    backgroundColor: '#F4F4F4'
  },
  transparent: {
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'inherit',
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
})

type Props = {
  onClick?(event: React.MouseEvent<HTMLAnchorElement>): void
  children?: React.ReactNode
  active?: boolean
  transparent?: boolean
}

const LeafletControlButton = (props: Props) => {
  const {
    onClick,
    children,
    active = false,
    transparent = false
  } = props

  const classes = useStyles();
  return (
    <a className={clsx(classes.root, {[classes.active]: active}, {[classes.transparent]: transparent})} onClick={onClick}>
      {children}
    </a>
  )
}

export default LeafletControlButton;