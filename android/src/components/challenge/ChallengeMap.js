import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ChallengeApi from '../../api/challenge.api';
import { Button } from '../ui';
import Map from './Map'
import UserSessionApi from '../../api/user-session.api';
import { useInterval } from '../../utils/useInterval';
import EndModal from '../modal/EndModal';
import IntersectionModal from '../modal/IntersectionModal';
import { useTraker } from "../../utils/traker";

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

export default ({ id, onUpdateRunningChallenge, navigation, transportMean }) => {
  const [base64, setBase64] = useState(null);
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [distanceBase, setDistanceBase] = useState(null);
  const [stepToRemove, setStepToRemove] = useState(0);
  const [endModal, setEndModal] = useState(false);
  const [intersections, setIntersections] = useState(null);
  const [selectedIntersection, setSelectedIntersection] = useState(null);
  const { subscribe, unsubscribe, getStepMeters, getGpsMeters, meterState } = useTraker(transportMean);

  let pause = () => {
    unsubscribe();
    onUpdateRunningChallenge(null);
  }

  let getFullDistance = () => {
    if (transportMean === 'pedometer') {
      let podometerValue = getStepMeters(stepToRemove);

      return Math.round((distanceBase + podometerValue) * 100) / 100;
    }

    return getGpsMeters();
  }

  let loadData = async () => {
    let responseDetail = await ChallengeApi.getDetail(id);

    setChallengeDetail(responseDetail.data);

    let responseSession = await UserSessionApi.self(id);

    setUserSession(responseSession.data);

    setDistanceBase(responseSession.data.totalAdvancement);

    let responseBase64 = await ChallengeApi.getBackgroundBase64(id);

    setBase64(responseBase64.data.background);

    subscribe();
  }

  useEffect(() => {

    loadData();

    return () => {
      unsubscribe();
    }

  }, [])

  let advance = async () => {

    if (transportMean === 'pedometer' && meterState?.currentStepCount !== null &&
      (meterState?.currentStepCount - stepToRemove) !== 0) {
      return;
    }

    let metersToAdvance;
    if (transportMean === 'pedometer') {
      metersToAdvance = (Math.round(((meterState.currentStepCount - stepToRemove) * 0.64) * 100) / 100)
    } else {
      metersToAdvance = getGpsMeters();
    }

    if (metersToAdvance == 0) {
      return;
    }

    console.log("advance",{
      challengeId: id,
      advancement: metersToAdvance,
    });

    let responseAdvance = await UserSessionApi.selfAdvance({
      challengeId: id,
      advancement: metersToAdvance,
    }).catch(e => {
      console.log(e)
    });

    setDistanceBase(responseAdvance.data.totalAdvancement);

    if (transportMean === 'pedometer') {
      setStepToRemove(meterState.currentStepCount);
    }

    setUserSession(responseAdvance.data);

    if (responseAdvance.data.isEnd === true) {
      Vibration.vibrate()
      setEndModal(true);
    }

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

      setIntersections(startSegments);
    }
  }

  let f = useCallback(async () => {
    advance();
  }, [meterState, stepToRemove]);

  useInterval(f, 1000);

  let endHandler = () => {
    setEndModal(false);
    navigation.navigate("Challenges");
  }

  let intersectionHandler = async (segementId) => {

    await UserSessionApi.selfChoosePath({
      challengeId: id,
      segmentToChooseId: segementId,
    });

    setIntersections(null);
  }

  return (
    <View style={styles.container}>

      <EndModal
        open={endModal}
        onExit={() => endHandler()} />

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