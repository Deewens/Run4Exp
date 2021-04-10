import * as React from 'react';

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    darker: string;
    darkGreen: string;
  }
}

declare module '@material-ui/core/Button' {
  interface ButtonPropsVariantOverrides {
    rounded: true
  }
}