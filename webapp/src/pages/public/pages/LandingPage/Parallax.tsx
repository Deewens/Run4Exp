import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Smartphone from "../../../../images/mockup-smartphone.png";
import {Box} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  parallax: {
    width: '100%',
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
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
    <Box
      className={classes.parallax}
      sx={{
        background: `fixed url(${Smartphone}) 85% 200%/50% no-repeat, fixed url(${image}) center no-repeat`,
        height: height ? height : '',
      }}>
      {children}

    </Box>
  )
};

export default Parallax;