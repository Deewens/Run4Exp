import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Theme,
  Typography
} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles"

type Props = {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

const useStyles = makeStyles<Theme, Partial<Props>>((theme: Theme) => ({
  root: props => ({
    borderLeft: `3px solid ${props.color}`,
    borderRadius: '0.25rem',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 115,
    padding: theme.spacing(1),
  }),
  logo: props => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: props.color,
    borderRadius: '50%',
    width: '65px',
    height: '65px',
  }),
  content: {
    width: '75%',
  }
}))


export default function StatsCard(props: Props) {
  const {
    title,
    value,
    icon,
    color,
  } = props
  const classes = useStyles({color})
  const theme = useTheme()

  return (
    <Card className={classes.root}>
      <div className={classes.logo}>
        {icon}
      </div>
      <CardContent className={classes.content}>
        <Typography variant="h5">
          {title}
        </Typography>
        <Typography variant="body1">
          {value}
        </Typography>
        <Divider/>
      </CardContent>
    </Card>
  )
}