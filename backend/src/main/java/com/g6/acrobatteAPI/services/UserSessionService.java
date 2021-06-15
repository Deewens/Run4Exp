package com.g6.acrobatteAPI.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.UserSessionResult;
import com.g6.acrobatteAPI.entities.events.Event;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.entities.events.EventChangeSegment;
import com.g6.acrobatteAPI.entities.events.EventChoosePath;
import com.g6.acrobatteAPI.entities.events.EventPassObstacle;
import com.g6.acrobatteAPI.entities.events.EventStartRun;
import com.g6.acrobatteAPI.entities.events.EventType;
import com.g6.acrobatteAPI.entities.events.GenericEvent;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.models.userSession.UserSessionBulkEventsModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionEventGenericModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionRunModel;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.g6.acrobatteAPI.repositories.Event.EventRepository;
import com.google.common.collect.Iterables;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSessionService {
    private final UserSessionRepository userSessionRepository;
    private final EventRepository userRepository;

    public UserSession getUserSession(Long id) throws ApiIdNotFoundException {
        return userSessionRepository.findById(id).orElseThrow(() -> new ApiIdNotFoundException("userSession", id));
    }

    public List<UserSession> getAllUserSessionsByUser(User user) {
        return userSessionRepository.findAllByUserOrderByInscriptionDateDesc(user);
    }

    public List<UserSession> getUserSessionsByChallenge(Challenge challenge) {
        return userSessionRepository.findAllByChallengeOrderByInscriptionDateDesc(challenge);
    }

    /**
     * Récupère les sessions ppartenant à l'utilisateur + options de filtrage
     * 
     * @param user:         l'utilisateur auquel appartiennent les sessions
     * @param ongoingOnly:  si true enlève toutes les sessions qui sont terminées
     * @param finishedOnly: si true enlève toutes les sessions qui sont pas
     *                      terminées
     * @return
     */
    public List<UserSession> getUserSessionsByUser(User user, Boolean ongoingOnly, Boolean finishedOnly) {
        var userSessions = userSessionRepository.findAllByUserOrderByInscriptionDateDesc(user);

        if (ongoingOnly) {
            var iter = userSessions.iterator();
            while (iter.hasNext()) {

                UserSession userSession = iter.next();

                // Liste d'événements vide - ne pas supprimer
                if (userSession.getEvents() == null || userSession.getEvents().size() == 0) {
                    continue;
                }

                // Si le dernier event est END - la session n'est pas ongoing - supprimer
                Event lastEvent = Iterables.getLast(userSession.getEvents(), null);

                if (lastEvent.getEventType() == EventType.END) {
                    iter.remove();
                }
            }
        }

        if (finishedOnly) {
            var iter = userSessions.iterator();
            while (iter.hasNext()) {

                UserSession userSession = iter.next();

                // Liste d'événements vide - ne peut pas être fini - supprimer
                if (userSession.getEvents() == null || userSession.getEvents().size() == 0) {
                    iter.remove();
                    continue;
                }

                // Si le dernier event n'est pas END - la session n'est pas finished - supprimer
                Event lastEvent = Iterables.getLast(userSession.getEvents(), null);
                if (lastEvent.getEventType() != EventType.END) {
                    iter.remove();
                }
            }
        }

        return userSessions;
    }

    public UserSession createUserSession(User user, Challenge challenge) throws ApiWrongParamsException {
        UserSession userSession = new UserSession();

        userSession.setUser(user);
        userSession.setChallenge(challenge);

        if (challenge.getFirstCheckpoint().isEmpty()) {
            throw new ApiWrongParamsException("Challenge", null, "Le challenge n'as pas de départ");
        }
        Checkpoint checkpoint = challenge.getFirstCheckpoint().orElseThrow(() -> new IllegalArgumentException());

        List<Segment> segments = checkpoint.getSegmentsStarts();
        if (segments == null || segments.size() == 0) {
            throw new ApiWrongParamsException("Challenge", null, "Le challenge n'as pas de départ");
        }
        Segment segment = segments.get(0);

        // Rajouter ChangeSegment
        // EventChangeSegment eventChangeSegment = new EventChangeSegment();
        // eventChangeSegment.setPassToSegment(segment);
        // eventChangeSegment.setDate(Date.from(Instant.now()));
        // eventChangeSegment.setUserSession(userSession);
        // userSession.addEvent(eventChangeSegment);

        userSession.setInscriptionDate(Date.from(Instant.now()));

        UserSession persistedUserSession = userSessionRepository.save(userSession);

        return persistedUserSession;
    }

    public UserSession saveBulkEvents(UserSession userSession, UserSessionBulkEventsModel eventsModel) {
        var genericEvents = new ArrayList<GenericEvent>();

        for (UserSessionEventGenericModel eventModel : eventsModel.getEvents()) {
            // traitement de la date
            var genericEvent = new GenericEvent();
            Instant instant = Instant.ofEpochSecond(eventModel.getDate());
            Date date = Date.from(instant);
            genericEvent.setDate(date);

            genericEvent.setEventType(eventModel.getType());
            genericEvent.setUserSession(userSession);
            genericEvent.setValue(eventModel.getValue());

            genericEvents.add(genericEvent);
        }

        userSession.getEvents().addAll(genericEvents);

        var persistedUserSession = userSessionRepository.save(userSession);

        return persistedUserSession;
    }

    public List<Event> getOrderedEvents(UserSession userSession) {
        return userRepository.findByUserSessionOrderByDate(userSession);
    }

    public UserSessionResult getUserSessionResult(UserSession userSession) {
        Double precision = 1e-2;
        Segment currentSegment = null;
        Double advancement = 0.0;
        Double totalAdvancement = 0.0;

        UserSessionResult userSessionResult = new UserSessionResult();
        List<Event> events = getOrderedEvents(userSession);

        userSessionResult.setId(userSession.getId());

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
        if ((Math.abs(advancement - currentSegment.getLength()) < precision)
                && currentSegment.getEnd().getSegmentsStarts().size() >= 1) {
            userSessionResult.setIsIntersection(true);
        } else {
            userSessionResult.setIsIntersection(false);
        }

        // Si on est à la fin du parcours
        if (advancement >= currentSegment.getLength() && currentSegment.getEnd().getSegmentsStarts().size() == 0) {
            userSessionResult.setIsEnd(true);
        } else {
            userSessionResult.setIsEnd(false);
        }

        // Si on est bloqués sur un l'obstacle
        for (Obstacle obstacle : currentSegment.getObstacles()) {
            Boolean skipObstacle = false;

            // Si on est suffisamment proches d'un obstacle
            if ((obstacle.getPosition() * currentSegment.getLength() - advancement) < precision) {

                // Si on a passé un obstacle
                for (Event event : events) {
                    if (event instanceof EventPassObstacle) {
                        EventPassObstacle eventPassObstacle = (EventPassObstacle) event;
                        // Si l'obstacle passé est celui qu'on vérifie - passer
                        if (eventPassObstacle.getObstacleToPass().getId() == obstacle.getId()) {
                            skipObstacle = true;
                        }
                    }
                }

                if (!skipObstacle)
                    userSessionResult.setObstacleId(obstacle.getId());
            }
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

    public UserSession processChoosePathEvent(UserSession userSession, Segment segmentToChoose)
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

    public UserSession processAdvanceEvent(UserSession userSession, Double advancement) {

        UserSessionResult sessionResultBefore = getUserSessionResult(userSession);

        // Ne pas enregistrer l'avancement
        if (advancement == 0.0 || sessionResultBefore.getIsEnd() || sessionResultBefore.getIsIntersection()
                || sessionResultBefore.getObstacleId() != null)
            return userSession;

        Double nextSegmentAdvancement = null;
        Boolean isBlocked = false;
        Date date = Date.from(Instant.now());

        Double newAdvancement = sessionResultBefore.getAdvancement() + advancement;
        Segment currentSegment = sessionResultBefore.getCurrentSegment();

        // Si l'avancement dépasse la longueur du segment
        if (newAdvancement > currentSegment.getLength()) {
            // L'avancement pour le prochain segment
            nextSegmentAdvancement = sessionResultBefore.getCurrentSegment().getLength()
                    - sessionResultBefore.getAdvancement();

            // S'il n'y a pas de croisements ou si la fin - bloquer le déplacement
            if (currentSegment.isIntersectionAtEnd() || currentSegment.isDeadEnd()) {
                isBlocked = true;
                newAdvancement = currentSegment.getLength();
            }
        }

        List<Event> events = userSession.getEvents();

        // Si on est bloqués sur un obstacle
        for (Obstacle obstacle : currentSegment.getObstacles()) {
            // Si l'obstacle est sur le chemin d'avancement
            // Si on a passé un obstacle
            if (Iterables.getLast(events) instanceof EventPassObstacle) {
                EventPassObstacle eventPassObstacle = (EventPassObstacle) Iterables.getLast(events);
                // Si l'obstacle passé est celui qu'on vérifie - passer
                if (eventPassObstacle.getObstacleToPass().getId() == obstacle.getId()) {
                    continue;
                }
            }

            if (sessionResultBefore.getAdvancement() < (obstacle.getPosition() * currentSegment.getLength())
                    && (obstacle.getPosition() * currentSegment.getLength()) < newAdvancement) {
                isBlocked = true;
                newAdvancement = (obstacle.getPosition() * currentSegment.getLength());
            }
        }

        // Rajouter l'avancement
        advancement = Math.abs(newAdvancement - sessionResultBefore.getAdvancement());
        addAdvanceEvent(userSession, advancement, date);

        // Persister
        userSession = userSessionRepository.save(userSession);

        // Au besoin - Passer au prochain segment et avancer - récurrence
        if (!isBlocked && nextSegmentAdvancement != null) {
            addChoosePathEvent(userSession, currentSegment.getEnd().getSegmentsStarts().get(0), date);
            return processAdvanceEvent(userSession, nextSegmentAdvancement);
        }

        return userSession;
    }

    public UserSession processStartRunEvent(UserSession userSession) {
        Event lastEvent = Iterables.getLast(userSession.getEvents());

        // Si on n'as pas avancé depuis le dernier run - skip
        if (lastEvent instanceof EventStartRun) {
            return userSession;
        }

        userSession = this.addStartRunEvent(userSession);
        userSession = userSessionRepository.save(userSession);

        return userSession;
    }

    /**
     * Fonction qui rajoute l'événement de l'avancement au UserSession
     * 
     * @param userSession
     * @param advancement
     * @param date
     * @return
     */
    private UserSession addAdvanceEvent(UserSession userSession, Double advancement, Date date) {
        EventAdvance eventAdvance = new EventAdvance();
        eventAdvance.setAdvancement(advancement);
        eventAdvance.setDate(date);
        eventAdvance.setUserSession(userSession);
        userSession.addEvent(eventAdvance);

        return userSession;
    }

    /**
     * Fonction qui rajoute l'événement de choix de chemin au UserSession
     * 
     * @param userSession
     * @param passToSegment
     * @param date
     * @return
     */
    private UserSession addChoosePathEvent(UserSession userSession, Segment passToSegment, Date date) {

        EventChangeSegment eventChangeSegment = new EventChangeSegment();
        eventChangeSegment.setPassToSegment(passToSegment);
        eventChangeSegment.setDate(date);
        eventChangeSegment.setUserSession(userSession);
        userSession.addEvent(eventChangeSegment);

        return userSession;
    }

    private UserSession addPassObstacleEvent(UserSession userSession, Obstacle obstacleToPass, Date date) {

        EventPassObstacle eventPassObstacle = new EventPassObstacle();
        eventPassObstacle.setObstacleToPass(obstacleToPass);
        eventPassObstacle.setDate(date);
        eventPassObstacle.setUserSession(userSession);
        userSession.addEvent(eventPassObstacle);

        return userSession;
    }

    public UserSession addStartRunEvent(UserSession userSession) {
        EventStartRun eventStartRun = new EventStartRun();
        eventStartRun.setDate(Date.from(Instant.now()));
        eventStartRun.setUserSession(userSession);

        userSession.addEvent(eventStartRun);

        return userSession;
    }

    public List<UserSessionRunModel> getRuns(UserSession userSession) throws ApiWrongParamsException {
        List<UserSessionRunModel> runs = new ArrayList<>();

        if (userSession.getEvents() == null || userSession.getEvents().size() <= 0) {
            return new ArrayList<>();
        }

        UserSessionRunModel userSessionRunModel = new UserSessionRunModel();
        userSessionRunModel.setUserSessionId(userSession.getId());
        userSessionRunModel.setStartDate(Iterables.getFirst(userSession.getEvents(), null).getDate());

        Double advancement = 0.0;

        // On commence à i=1: On passe le premier EventStartRun
        for (int i = 2; i < userSession.getEvents().size(); ++i) {
            Event event = Iterables.get(userSession.getEvents(), i);

            // Prochain run
            if (event instanceof EventStartRun) {
                EventStartRun eventStartRun = (EventStartRun) event;

                userSessionRunModel.setUserSessionId(userSession.getId());
                userSessionRunModel.setAdvancement(advancement);
                userSessionRunModel.setEndDate(eventStartRun.getDate());
                runs.add(userSessionRunModel);

                userSessionRunModel = new UserSessionRunModel();
                userSessionRunModel.setStartDate(eventStartRun.getDate());

                advancement = 0.0;
            }
            // Avancer
            else if (event instanceof EventAdvance) {
                EventAdvance eventAdvance = (EventAdvance) event;
                advancement += eventAdvance.getAdvancement();
            }
        }

        // Si ya une course pas terminée - quand même ajouter
        if (advancement != 0.0) {
            userSessionRunModel.setAdvancement(advancement);
            runs.add(userSessionRunModel);
        }

        return runs;
    }

    public UserSession processPassObstacle(UserSession userSession, Obstacle obstacleToPass)
            throws ApiWrongParamsException {
        UserSessionResult userSessionResult = getUserSessionResult(userSession);
        if (userSessionResult.getObstacleId() != obstacleToPass.getId()) {
            throw new ApiWrongParamsException("ObstacleToPass", "Id de l'obstacle n'est pas bon");
        }

        Date date = Date.from(Instant.now());

        userSession = this.addPassObstacleEvent(userSession, obstacleToPass, date);

        userSession = userSessionRepository.save(userSession);

        return userSession;
    }

}
