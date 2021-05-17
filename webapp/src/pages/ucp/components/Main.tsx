import * as React from 'react'
import Routing from './Routing';
import {MainProvider} from "../useMain";

export const drawerWidth = 240;

const Main = () => {
  return (
    <MainProvider>
      <Routing/>
    </MainProvider>
  )
}

export default Main