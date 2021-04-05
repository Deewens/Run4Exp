import * as React from "react"
import {Redirect, Route, Switch} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";


const Routing = () => {
  return (
    <Switch>
      <Route path="/signin"><Signin/></Route>
      <Route path="/signup"><Signup/></Route>
      <Route path="/"><LandingPage/></Route>
      <Redirect exact from="*" to="/"/>
    </Switch>
  )
}

export default Routing