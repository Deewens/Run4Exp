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
export function getCookie (name: string) {
  let value = '; ' + document.cookie;
  let parts = value.split(`; ${name}=`);
  if (parts.length == 2) return parts.pop()?.split(';').shift();
}

/**
 * Calcul l'avancement en mètre du joueur sur le challenge à l'aide des évènements renvoyés par l'API
 *
 * @param events
 */
export function getUserAdvancementOnSegment(events: EventSession[]) {
  let totalMeters = 0

  let currentSegment = 0

  events.reverse().forEach((event) => {
    if (event.type === 'CHOOSE_PATH' || event.type === 'CHANGE_SEGMENT') {
      currentSegment = parseInt(event.value)
      return
    }
  })

  // Si l'event choose_path n'existe pas, c'est que le joueur est toujours sur le segment du début, il faut donc le trouver à partir du checkpoint BEGIN
  if (currentSegment === 0) {
    checkpoints.forEach(checkpoint => {
      if (checkpoint.attributes.checkpointType === 'BEGIN') {
        currentSegment = checkpoint.attributes.segmentsStartsIds[0] // On est sûr que l'id du segment est à l'index 0 car un challenge publié ne peut avoir qu'un seul segment qui part du checkpoint BEGIN
      }
    })
  }

  events.forEach(event => {
    if (event.type === "ADVANCE") {
      totalMeters += parseInt(event.value)
    }
  })

  return totalMeters
}

/**
 * Calcul l'avancement en mètre du joueur sur le segment actuel
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

export function getPlayerPosition(challenge: Challenge, userSession: UserSession, segments: Segment[], checkpoints: Checkpoint[]) {
  // Si le tableau est vide
  // on considère que le tableau event est pas vide

  // Recherche de l'ID du segment sur lequel se trouve l'utilisateur
  let eventsReversed = userSession.attributes.events.reverse()
  let currentSegment = 0

  eventsReversed.forEach((event) => {
    if (event.type === 'CHOOSE_PATH' || event.type === 'CHANGE_SEGMENT') {
      currentSegment = parseInt(event.value)
      return
    }
  })

  // Si l'event choose_path n'existe pas, c'est que le joueur est toujours sur le segment du début, il faut donc le trouver à partir du checkpoint BEGIN
  if (currentSegment === 0) {
    checkpoints.forEach(checkpoint => {
      if (checkpoint.attributes.checkpointType === 'BEGIN') {
        currentSegment = checkpoint.attributes.segmentsStartsIds[0] // On est sûr que l'id du segment est à l'index 0 car un challenge publié ne peut avoir qu'un seul segment qui part du checkpoint BEGIN
      }
    })
  }

  let selectedSegment = segments.find(x => x.id === currentSegment);

  if (selectedSegment) {
    let advancement = userSession.attributes.advancement
    if (userSession.attributes.advancement > selectedSegment.attributes.length) advancement = selectedSegment.attributes.length

    let roundedDistance = Math.round((advancement / 100) * 100) / challenge.attributes.scale;
    let position = calculateCoordOnPolyline(selectedSegment.attributes.coordinates, roundedDistance)

    if (position) return L.latLng(position.y, position.x)
  }

  return L.latLng(0, 0)
}