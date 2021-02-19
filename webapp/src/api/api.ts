import {authFetch, checkStatus, unauthFetch, urlPrefix} from "./utils";
import {ChallengeCreate, CheckpointCreate, SegmentCreate, User, UserSignIn} from "@acrobatt";

const Api = {
  signup: (user: User) => {
    return unauthFetch(`${urlPrefix}/users/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user),
    })
      .then(res => res.json())
  },

  signin: (user: UserSignIn) => {
    console.log(JSON.stringify(user));
    return unauthFetch(`${urlPrefix}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
  },

  getSignedInUser: () => {
    return authFetch(`${urlPrefix}/users/self`, {
      method: 'GET',
    })
      .then(res => res.json())
  },

  getChallenges: () => {
    return authFetch(`${urlPrefix}/challenges?page=0&size=10&sort=name,desc&sort=description,asc`, {
      method: 'GET',
    })
      .then(res => res.json())
  },

  createChallenge: (challenge: ChallengeCreate) => {
    return authFetch(`${urlPrefix}/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challenge)
    })
      .then(res => res.json())
  },

  uploadChallengeImage: (id: number, img: ImageBitmap) => {
    const formData = new FormData();
    //formData.append('file', img);


    return authFetch(`${urlPrefix}/challenges/${id}/background`, {
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data'},
      body: formData
    })
  },

  getChallengeImage: (id: number) => {
    return authFetch(`${urlPrefix}/challenges/${id}/background`, {
      method: 'GET',
    })
      .then(r => r.arrayBuffer())
      .then(img => URL.createObjectURL(new Blob([img], {type: 'image/png'})))
  },

  createCheckpoint: (checkpoint: CheckpointCreate) => {
    return authFetch(`${urlPrefix}/checkpoints`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(checkpoint)
    })
      .then(res => res.json())
  },

  createSegment: (segment: SegmentCreate) => {
    return authFetch(`${urlPrefix}/segments`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(segment)
    })
  }
}

export default Api;