import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import ObstacleApi from '../../api/obstacle.api';
import { Button } from '../ui';
import Map from './Map'
import UserSessionApi from '../../api/user-session.api';
import { useInterval } from '../../utils/useInterval';
import EndModal from '../modal/EndModal';
import IntersectionModal from '../modal/IntersectionModal';
import { useTraker } from "../../utils/traker";
import ObstacleModal from '../modal/ObstacleModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonPause: {
    zIndex: 100,
    bottom: 20,
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  metersCount: {
    zIndex: 100,
    top: 10,
    margin: 10,
    padding: 10,
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    opacity: 0.8,
  },
  box: {
    height: 150,
    width: 150,
    borderRadius: 5,
    position: "absolute",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  }
});

export default ({ navigation,route }) => {

  const { challengeId, sessionId, choosenTransport} = route.params;

  const [base64, setBase64] = useState(null);
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [distanceBase, setDistanceBase] = useState(null);
  const [advanceToRemove, setAdvanceToRemove] = useState(0);
  const [endModal, setEndModal] = useState(false);
  const [intersections, setIntersections] = useState(null);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const [canProgress, setCanProgress] = useState(true);
  const [modalObstacle, setModalObstacle] = useState(null);
  const { subscribe, unsubscribe, getStepMeters, getGpsMeters, meterState } = useTraker(choosenTransport, canProgress);

  let pause = () => {
    unsubscribe();
  }

  let getFullDistance = () => {
    if (choosenTransport === 'pedometer') {
      let podometerValue = getStepMeters(advanceToRemove);

      return Math.round((distanceBase + podometerValue) * 100) / 100;
    }
    var l = distanceBase + getGpsMeters(advanceToRemove);
    console.log("full distance", l);
    return Math.round(l * 100) / 100;
  }

  let loadData = async () => {
    let responseDetail = await ChallengeApi.getDetail(challengeId);

    setChallengeDetail(responseDetail.data);

    await UserSessionApi.startRun(sessionId);

    let responseObstacles = [];

    responseDetail.data.segments.forEach(async (element) => {
      await ObstacleApi.getBySegementId(element.id).then(res => {
        res.data.forEach(elementob => {
          responseObstacles.push(elementob);
        });

      }).catch();
    });

    setObstacles(responseObstacles);

    let responseSession = await UserSessionApi.getById(sessionId);

    setUserSession(responseSession.data);

    setDistanceBase(responseSession.data.totalAdvancement);

    let responseBase64 = await ChallengeApi.getBackgroundBase64(challengeId);

    setBase64(responseBase64.data.background);

    subscribe();
  }

  useEffect(() => {

    loadData();

    return () => {
      unsubscribe();
    }

  }, [])

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {

//       setBase64(null);
//       setChallengeDetail(null);
//       setObstacles([]);
//       setUserSession(null);
//       setDistanceBase(null);
//       setAdvanceToRemove(0);
//       setEndModal(false);
//       setIntersections(null);
//       setSelectedIntersection(null);
//       setCanProgress(true);
//       setModalObstacle(null);
      
//       readData();
//     });
//     return unsubscribe;
// }, [navigation]);


  // Fonction qui permet de vérifier l'avancement d'un utilisateur grâce au backend.
  // Elle permet aussi de mettre à jour le userSession pour change le userSessions
  let advance = async () => {

    // if (choosenTransport === 'pedometer' && meterState?.currentStepCount !== null &&
    // (meterState?.currentStepCount - advanceToRemove) !== 0) {
    //   return;
    // }


    // Récupération de la distance à ajouter
    let metersToAdvance;
    if (choosenTransport === 'pedometer') {
      metersToAdvance = (Math.round(((meterState.currentStepCount - advanceToRemove) * 0.64) * 100) / 100)
    } else {
      metersToAdvance = getGpsMeters(advanceToRemove);
    }

    if (metersToAdvance <= 0) {
      return;
    }

    // Requète à l'api
    let responseAdvance = await UserSessionApi.selfAdvance(sessionId, {
      challengeId: challengeId,
      advancement: metersToAdvance,
    });

    // Mise à jour de la distance de base
    setDistanceBase(responseAdvance.data.totalAdvancement);

    // Mise à jour de la distance parcourue depuis la reprise du challenge
    if (choosenTransport === 'pedometer') {
      setAdvanceToRemove(meterState.currentStepCount);
    } else {
      setAdvanceToRemove(Math.round((metersToAdvance + advanceToRemove) * 100) / 100);
    }

    // Mise à jour de l'userSession
    setUserSession(responseAdvance.data);

    // Gestion de la fin d'un challenge
    if (responseAdvance.data.isEnd === true) {
      Vibration.vibrate()
      setEndModal(true);
      setCanProgress(false);
    }

    // Gestion d'une intersection d'un challenge
    if (responseAdvance.data.isIntersection === true) {
      Vibration.vibrate()

      let segment = challengeDetail.segments.find(o => o.id === responseAdvance.data.currentSegmentId);
      let checkpoint = challengeDetail.checkpoints.find(o => o.id === segment.checkpointEndId);

      let startSegments = [];

      checkpoint.segmentsStartsIds.forEach(element => {
        let segmentSelected = challengeDetail.segments.find(o => o.id === element);

        if (segmentSelected) {

          startSegments.push({
            id: segmentSelected.id,
            length: segmentSelected.length
          });
        }

      });

      setCanProgress(false);
      setIntersections(startSegments);
    }

    if(responseAdvance.data.obstacleId !== null){
      Vibration.vibrate()
      let ob = obstacles.find(o => o.id === responseAdvance.data.obstacleId);

      setModalObstacle(ob);
      setCanProgress(false);
    } 
  }

  let f = useCallback(async () => {
    advance();
  }, [meterState, advanceToRemove]);

  useInterval(f, 1000);

  let endHandler = () => {
    setEndModal(false);
    navigation.navigate("Challenges");
  }

  let intersectionHandler = async (segementId) => {

    await UserSessionApi.selfChoosePath(sessionId,{
      challengeId: challengeId,
      segmentToChooseId: segementId,
    }).catch(e => {
      console.log(e.response)
    });

    setIntersections(null);
    setCanProgress(true);
  }
  
  // Validation de l'obstacle
  let handleObstacleExit = async () => {
    await UserSessionApi.passObstacle(sessionId,userSession.obstacleId);
    setModalObstacle(null);
    setCanProgress(true);
  }

  return (
    <View style={styles.container}>

      <EndModal
        open={endModal}
        onExit={() => endHandler()} />

      <ObstacleModal
        open={modalObstacle !== null}
        obstacle={modalObstacle}
        onExit={() => handleObstacleExit()} />

      {
        intersections == null ? null :
          (<IntersectionModal
            open={intersections != null}
            intersections={intersections}
            onHighLight={(iId) => setSelectedIntersection(iId)}
            onExit={(iId) => intersectionHandler(iId)} />)
      }


      {base64 && challengeDetail ? (
        <View style={StyleSheet.absoluteFill}>

          <Map
            base64={base64}
            checkpoints={challengeDetail.checkpoints}
            obstacles={obstacles}
            segments={challengeDetail.segments}
            selectedSegmentId={userSession.currentSegmentId}
            highlightSegmentId={selectedIntersection}
            totalDistance={getFullDistance()}
            distance={getFullDistance() + userSession.advancement}
            scale={challengeDetail.scale}
          />

          <Animated.View style={[styles.buttonPause]}>

            <Button
              icon="pause"
              padding={10}
              width={50}
              color="red"
              onPress={pause}
            />

          </Animated.View>

          <Animated.View style={[styles.metersCount]}>

            <Text>{getFullDistance()} mètres</Text>

          </Animated.View>

        </View>
      )
        : (<>
          <Text>Chargement</Text>
        </>)
      }
    </View >
  );
};