package com.g6.acrobatteAPI.services;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.UserSessionResult;
import com.g6.acrobatteAPI.entities.events.Event;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.entities.events.EventChangeSegment;
import com.g6.acrobatteAPI.entities.events.EventChoosePath;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.g6.acrobatteAPI.repositories.Event.EventRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSessionService {
    private final UserSessionRepository userSessionRepository;
    private final EventRepository userRepository;

    public UserSession getUserSession(Long id) {
        return userSessionRepository.findById(id).get();
    }

    public UserSession getUserSessionByUser(User user) {
        return userSessionRepository.findOneByUser(user);
    }

    public UserSession createUserSession(User user, Challenge challenge) throws ApiWrongParamsException {
        UserSession userSession = new UserSession();

        userSession.setUser(user);
        userSession.setChallenge(challenge);

        if (challenge.getFirstCheckpoint().isEmpty()) {
            throw new ApiWrongParamsException("Challenge", null, "Le challenge n'as pas de départ");
        }
        Checkpoint checkpoint = challenge.getFirstCheckpoint().get();

        List<Segment> segments = checkpoint.getSegmentsStarts();
        if (segments == null || segments.size() == 0) {
            throw new ApiWrongParamsException("Challenge", null, "Le challenge n'as pas de départ");
        }
        Segment segment = segments.get(0);

        EventChangeSegment eventInit = new EventChangeSegment();
        eventInit.setPassToSegment(segment);
        eventInit.setDate(Date.from(Instant.now()));
        eventInit.setUserSession(userSession);
        userSession.addEvent(eventInit);

        UserSession persistedUserSession = userSessionRepository.save(userSession);

        return persistedUserSession;
    }

    public List<Event> getOrderedEvents(UserSession userSession) {
        return userRepository.findByUserSessionOrderByDate(userSession);
    }

    public UserSessionResult getUserSessionResult(UserSession userSession) {
        Segment currentSegment = null;
        Double advancement = 0.0;
        Double totalAdvancement = 0.0;

        UserSessionResult userSessionResult = new UserSessionResult();
        List<Event> events = getOrderedEvents(userSession);

        for (Event event : events) {
            if (event instanceof EventAdvance) {
                EventAdvance eventAdvance = (EventAdvance) event;
                totalAdvancement += eventAdvance.getAdvancement();
            }
        }

        for (Event event : events) {
            if (event instanceof EventChangeSegment) {
                EventChangeSegment eventChangeSegment = (EventChangeSegment) event;
                currentSegment = eventChangeSegment.getPassToSegment();
                advancement = 0.0;
            } else if (event instanceof EventAdvance) {
                EventAdvance eventAdvance = (EventAdvance) event;
                advancement += eventAdvance.getAdvancement();
            } else if (event instanceof EventChoosePath) {
                EventChoosePath eventChoosePath = (EventChoosePath) event;
                currentSegment = eventChoosePath.getSegmentToChoose();
                advancement = 0.0;
            }
        }

        // Si on est au croisement
        if (advancement == currentSegment.getLength() && currentSegment.getEnd().getSegmentsStarts().size() >= 1) {
            userSessionResult.setIsIntersection(true);
        } else {
            userSessionResult.setIsIntersection(false);
        }

        // Si on est à la fin du parcours
        if (advancement == currentSegment.getLength() && currentSegment.getEnd().getSegmentsStarts().size() == 0) {
            userSessionResult.setIsEnd(true);
        } else {
            userSessionResult.setIsEnd(false);
        }

        userSessionResult.setCurrentSegment(currentSegment);
        userSessionResult.setAdvancement(advancement);
        userSessionResult.setTotalAdvancement(totalAdvancement);

        return userSessionResult;
    }

    public Optional<UserSession> findUserSessionByUser(User user) {
        UserSession userSession = userSessionRepository.findOneByUser(user);

        if (userSession == null) {
            return Optional.empty();
        }

        return Optional.of(userSession);
    }

    public Optional<UserSession> findUserSessionByUserAndChallenge(User user, Challenge challenge) {
        return userSessionRepository.findOneByUserAndChallenge(user, challenge);
    }

    public UserSession addChoosePathEvent(UserSession userSession, Segment segmentToChoose)
            throws ApiNoResponseException, ApiWrongParamsException {
        UserSessionResult sessionResult = getUserSessionResult(userSession);
        if (!sessionResult.getIsIntersection()) {
            throw new ApiNoResponseException("", "Vous n'êtes pas sur un croisement");
        }

        if (!sessionResult.getCurrentSegment().getEnd().getSegmentsStarts().contains(segmentToChoose)) {
            Long correctSegmentId = sessionResult.getCurrentSegment().getEnd().getSegmentsStarts().get(0).getId();
            throw new ApiWrongParamsException("segmentToChoose", "segmentToChooseId: " + correctSegmentId,
                    "Vous devez choisir un segment de l'intesection");
        }

        EventChoosePath eventChoosePath = new EventChoosePath();
        eventChoosePath.setDate(Date.from(Instant.now()));
        eventChoosePath.setUserSession(userSession);
        eventChoosePath.setSegmentToChoose(segmentToChoose);
        userSession.addEvent(eventChoosePath);

        UserSession persistedUserSession = userSessionRepository.save(userSession);

        return persistedUserSession;
    }

    /**
     * TODO: REMPLACER LES IF-ELSE PAR LES EVENT LISTENERS
     */
    public UserSession addAdvanceEvent(UserSession userSession, Double advancement) {
        UserSessionResult sessionResultBefore = getUserSessionResult(userSession);

        Double newAdvancement = advancement;
        Double nextSegmentAdvancement = null;
        Boolean isNextSegment = false;
        Date date = Date.from(Instant.now());

        // Si l'avancement dépasse la longueur du segment et le segment se trouve devant
        // un croisement
        if (sessionResultBefore.getAdvancement() + advancement > sessionResultBefore.getCurrentSegment().getLength()
                && sessionResultBefore.getCurrentSegment().getEnd().getSegmentsStarts().size() > 1) {
        }

        Double globalAdvancement = sessionResultBefore.getAdvancement() + advancement;
        Segment currentSegment = sessionResultBefore.getCurrentSegment();

        // Si l'avancement dépasse la longueur du segment
        if (globalAdvancement > currentSegment.getLength()) {
            // S'avancer que pour atteindre le boût du segment
            newAdvancement = sessionResultBefore.getCurrentSegment().getLength() - sessionResultBefore.getAdvancement();

            // S'il n'y a pas de croisements
            if (currentSegment.getEnd().getSegmentsStarts().size() == 1) {
                nextSegmentAdvancement = advancement - newAdvancement;
                isNextSegment = true;
            }
        }

        // Rajouter l'avancement
        EventAdvance eventAdvance = new EventAdvance();
        eventAdvance.setAdvancement(newAdvancement);
        eventAdvance.setDate(date);
        eventAdvance.setUserSession(userSession);
        userSession.addEvent(eventAdvance);

        // Passer au prochain segment
        if (isNextSegment) {
            EventChangeSegment eventChangeSegment = new EventChangeSegment();
            eventChangeSegment.setPassToSegment(currentSegment.getEnd().getSegmentsStarts().get(0));
            eventChangeSegment.setDate(date);
            eventChangeSegment.setUserSession(userSession);
            userSession.addEvent(eventChangeSegment);

            // Rajouter le nouveau avancement
            EventAdvance nextEventAdvance = new EventAdvance();
            nextEventAdvance.setAdvancement(nextSegmentAdvancement);
            nextEventAdvance.setDate(date);
            nextEventAdvance.setUserSession(userSession);
            userSession.addEvent(nextEventAdvance);
        }

        UserSession persitedUserSession = userSessionRepository.save(userSession);

        return persitedUserSession;
    }
}
