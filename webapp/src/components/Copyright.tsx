import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import * as React from "react";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Acrobatt
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}