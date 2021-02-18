package com.g6.acrobatteAPI.services;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Endpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.entities.events.EventChangeSegment;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserSessionService {
    private final UserSessionRepository userSessionRepository;

    public UserSession getUserSession(Long id) {
        return userSessionRepository.findById(id).get();
    }

    public UserSession getUserSessionByUser(User user) {
        return userSessionRepository.findOneByUser(user);
    }

    public UserSession createUserSession(User user, Challenge challenge) {
        UserSession userSession = new UserSession();

        userSession.setUser(user);
        userSession.setChallenge(challenge);

        if (challenge.getFirstEndpoint().isEmpty()) {
            throw new IllegalArgumentException("Le challenge n'as pas de départ");
        }
        Endpoint endpoint = challenge.getFirstEndpoint().get();

        List<Segment> segments = endpoint.getSegmentsStarts();
        if (segments == null || segments.size() == 0) {
            throw new IllegalArgumentException("Le challenge n'as pas de départ");
        }
        Segment segment = segments.get(0);

        EventChangeSegment eventInit = new EventChangeSegment();
        eventInit.setPassToSegment(segment);
        userSession.addEvent(eventInit);

        UserSession persistedUserSession = userSessionRepository.save(userSession);

        return persistedUserSession;
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

    public UserSession addAdvanceEvent(UserSession userSession, Double advancement) {
        EventAdvance eventAdvance = new EventAdvance();
        eventAdvance.setAdvancement(advancement);

        Date date = Date.from(Instant.now());
        eventAdvance.setDate(date);
        eventAdvance.setAdvancement(advancement);

        userSession.addEvent(eventAdvance);

        UserSession persitedUserSession = userSessionRepository.save(userSession);

        return persitedUserSession;
    }
}
