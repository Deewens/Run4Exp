import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {
    width: '30px',
    height: '30px',
    lineHeight: '30px',
    textAlign: 'center',
    overflow: 'hidden',
    margin: '0',
    borderBottom: '1px solid #ccc',
    cursor: 'pointer',
    color: 'black',
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#F4F4F4',
    }
  },
  active: {
    backgroundColor: '#F4F4F4'
  }
})

type Props = {
  onClick?: ((event: React.MouseEvent<Element, MouseEvent>) => void) | undefined
  children: React.ReactNode
  active: boolean
}

const LeafletControlButton = (props: Props) => {
  const {
    onClick,
    children,
    active
  } = props;

  const classes = useStyles();
  return (
    <a className={clsx(classes.root, {[classes.active]: active})} onClick={onClick}>
      {children}
    </a>
  )
}

export default LeafletControlButton;