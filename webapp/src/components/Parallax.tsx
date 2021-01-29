import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  parallax: {
    width: '100%',
    height: "100vh",
    overflow: "hidden",
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundSize: "cover",
    display: "flex",
    alignItems: "center",
    userSelect: 'none',
  },
}));

type Props = {
  image: string
  height?: string
  children?: any
}

const Parallax = ({image, children, height}: Props) => {
  const classes = useStyles();

  return (
    <div
      className={classes.parallax}
      style={{
        backgroundImage: `url(${image})`,
        height: height ? height : '',
      }}>
      {children}
    </div>
  )
};

export default Parallax;