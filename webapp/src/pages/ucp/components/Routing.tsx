import * as React from "react"
import {Route, Switch} from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import Leaflet from "./Leaflet";
import ChallengeList from "../pages/ChallengeList";
import ChallengeEditor from "../pages/ChallengeEditor";

const Routing = () => {
  return (
    <Switch>
      <ProtectedRoute path="/ucp/challenges"><ChallengeList/></ProtectedRoute>
      <ProtectedRoute path="/ucp/challenge-editor/:id"><ChallengeEditor/></ProtectedRoute>
    </Switch>
  )
}

export default Routing