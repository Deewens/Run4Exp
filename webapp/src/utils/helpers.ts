import {EventSession, UserSession} from "../api/entities/UserSession";
import {calculateCoordOnPolyline} from "./orthonormalCalculs";
import L from "leaflet";
import {Segment} from "../api/entities/Segment";
import {Challenge} from "../api/entities/Challenge";
import {Checkpoint} from "../api/entities/Checkpoint";

/**
 * Get the value of a cookie
 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
 * @param  {String} name  The name of the cookie
 * @return {String}       The cookie value
 */
export function getCookie(name: string) {
  let value = '; ' + document.cookie;
  let parts = value.split(`; ${name}=`);
  if (parts.length == 2) return parts.pop()?.split(';').shift();
}

/**
 * Calcul l'avancement en mètre du joueur sur le challenge
 *
 * @param events
 */
export function getUserAdvancement(events: EventSession[]) {
  let totalMeters = 0

  events.forEach(event => {
    if (event.type === "ADVANCE") {
      totalMeters += parseInt(event.value)
    }
  })

  return totalMeters
}

/**
 * Calcul l'avancement en mètre du joueur sur le challenge à l'aide des évènements renvoyés par l'API
 *
 * @param events
 */
export function getUserAdvancementOnSegment(events: EventSession[]) {
  let eventsReversed = events
  let cumul = 0
  for (let event of eventsReversed) {
    console.log(event)
    console.log(cumul)
    if (event.type == 'CHANGE_SEGMENT') {
      break;
    }

    if (event.type === 'ADVANCE') {
      cumul = cumul + parseFloat(event.value)
    }
  }
  console.log(cumul)
  return cumul
}

export function getPlayerPosition(challenge: Challenge, userSession: UserSession, segments: Segment[], checkpoints: Checkpoint[]) {
  let latLng = L.latLng(0, 0)

  // Recherche de l'ID du segment sur lequel se trouve l'utilisateur
  let eventsReversed = userSession.attributes.events.reverse()

  let currentSegmentId = 0
  for (let event of eventsReversed) {
    if (event.type === 'CHANGE_SEGMENT') {
      currentSegmentId = parseInt(event.value)
      break
    }
  }
  if (currentSegmentId === 0) {
    checkpoints.forEach(checkpoint => {
      if (checkpoint.attributes.checkpointType === 'BEGIN') {
        currentSegmentId = checkpoint.attributes.segmentsStartsIds[0] // On est sûr que l'id du segment est à l'index 0 car un challenge publié ne peut avoir qu'un seul segment qui part du checkpoint BEGIN
      }
    })
  }

  let advancementOnSegment = getUserAdvancementOnSegment(userSession.attributes.events)


  let selectedSegment = segments.find(x => x.id === currentSegmentId);
  if (selectedSegment) {
    let roundedAdvancement = Math.round(advancementOnSegment * 100) / 100;
    if (roundedAdvancement >= selectedSegment.attributes.length) roundedAdvancement = Math.round(selectedSegment.attributes.length * 100)/100
    console.log("test", roundedAdvancement/challenge.attributes.scale)
    let position = calculateCoordOnPolyline(selectedSegment.attributes.coordinates, roundedAdvancement / challenge.attributes.scale)
    if (position) {
      console.log(position)
      latLng = L.latLng(position.y, position.x)
    }
  }

  return latLng

  //
  // // Si l'event choose_path n'existe pas, c'est que le joueur est toujours sur le segment du début, il faut donc le trouver à partir du checkpoint BEGIN
  // if (currentSegment === 0) {
  //   checkpoints.forEach(checkpoint => {
  //     if (checkpoint.attributes.checkpointType === 'BEGIN') {
  //       currentSegment = checkpoint.attributes.segmentsStartsIds[0] // On est sûr que l'id du segment est à l'index 0 car un challenge publié ne peut avoir qu'un seul segment qui part du checkpoint BEGIN
  //     }
  //   })
  // }
  //
  // let segmentDistance = 0
  // for (let i = 0; i < eventsReversed.length; i++) {
  //   console.log(eventsReversed[i])
  //   if (eventsReversed[i].type === 'CHOOSE_PATH' || eventsReversed[i].type === 'CHANGE_SEGMENT') break
  //   if (eventsReversed[i].type === 'ADVANCE') {
  //     segmentDistance += parseInt(eventsReversed[i].value)
  //   }
  // }
  //
  // console.log(segmentDistance)
  //
  // let selectedSegment = segments.find(x => x.id === currentSegment);
  //
  // if (selectedSegment) {
  //   let advancement = segmentDistance
  //   if (segmentDistance > selectedSegment.attributes.length) advancement = selectedSegment.attributes.length
  //   console.log(advancement)
  //
  //   //let roundedDistance = Math.round((advancement / 100) * 100) / challenge.attributes.scale;
  //   let position = calculateCoordOnPolyline(selectedSegment.attributes.coordinates, advancement / challenge.attributes.scale)
  //
  //   if (position) return L.latLng(position.y, position.x)
  // }
  //


}