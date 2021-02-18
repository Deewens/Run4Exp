import * as React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
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
  clicked: {
    backgroundColor: '#F4F4F4'
  }
})

type Props = {
  onClick?: ((event: React.MouseEvent<Element, MouseEvent>) => void) | undefined
  children: React.ReactNode
}

const LeafletControlButton = (props: Props) => {
  const {
    onClick,
    children
  } = props;

  const [clicked, setClicked] = useState(false);

  const handleBtnClick = (e: React.MouseEvent) => {
    //setClicked(!clicked);
    onClick && onClick(e);
  }

  const classes = useStyles();
  return (
    <a className={clsx(classes.root, {[classes.clicked]: clicked})} onClick={handleBtnClick}>
      {children}
    </a>
  )
}

export default LeafletControlButton;