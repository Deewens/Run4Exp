import * as React from "react"
import {Route, Switch} from "react-router-dom";
import ProtectedRoute from "../../shared/components/ProtectedRoute";
import ChallengeList from "../pages/AdminChallengeList";
import ChallengeEditor from "../pages/ChallengeEditor";
import Home from "../pages/Home";
import MyChallenges from "../pages/MyChallenges";
import AccountProfile from "../pages/AccountProfile";
import MapView from "../pages/MyChallenges/MapView";
import Index from "../pages/FindChallenges";
import PublishedChallengesAdmin from "../pages/PublishedChallengesAdmin";
import AdminMapView from "../pages/PublishedChallengesAdmin/AdminMapView";

const Routing = () => {
  return (
    <Switch>
      <ProtectedRoute exact path="/ucp"><Home /></ProtectedRoute>
      <ProtectedRoute path="/ucp/challenges"><ChallengeList /></ProtectedRoute>
      <ProtectedRoute path="/ucp/challenge-editor/:id"><ChallengeEditor /></ProtectedRoute>
      <ProtectedRoute path="/ucp/my-challenges/:id"><MapView /></ProtectedRoute>
      <ProtectedRoute path="/ucp/my-challenges"><MyChallenges /></ProtectedRoute>
      <ProtectedRoute path="/ucp/account-profile"><AccountProfile /></ProtectedRoute>
      <ProtectedRoute path="/ucp/find-challenge"><Index /></ProtectedRoute>
      <ProtectedRoute path="/ucp/admin-published-challenges/:id"><AdminMapView /></ProtectedRoute>
      <ProtectedRoute path="/ucp/admin-published-challenges"><PublishedChallengesAdmin /></ProtectedRoute>
    </Switch>
  )
}

export default Routing