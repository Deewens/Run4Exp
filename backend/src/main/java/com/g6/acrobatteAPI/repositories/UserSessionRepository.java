package com.g6.acrobatteAPI.repositories;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.events.Event;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    public UserSession findOneByUser(User user);

    @Query("SELECT us FROM UserSession us where us.user = ?1 AND us.challenge = ?2")
    public Optional<UserSession> findOneByUserAndChallenge(User user, Challenge challenge);

    public List<UserSession> findAllByChallenge(Challenge challenge);
}
