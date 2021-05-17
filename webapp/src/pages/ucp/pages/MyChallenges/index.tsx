import * as React from 'react'
import MyChallengeCard from "../../components/MyChallengeCard";
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
import {Challenge} from "../../../../api/entities/Challenge";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(4),
    maxWidth: 1000,
  }
}))

export default function MyChallenges() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MyChallengeCard challenge={new Challenge({}, 0)}/>
    </div>
  )
}