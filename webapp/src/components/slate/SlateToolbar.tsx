import * as React from 'react'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      display: 'inline-block',
    },
    '& > * + *': {
      marginLeft: '15px',
    },
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    padding: '1px 18px 17px',
    margin: '0 -20px',
    borderBottom: '2px solid #eee',
    marginBottom: '20px',
  },
}))

type Props = {
  children: React.ReactNode
}

const SlateToolbar = ({children}: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {children}
    </div>
  )
}

export default SlateToolbar