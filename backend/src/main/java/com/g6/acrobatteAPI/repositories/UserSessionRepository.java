package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    public UserSession findOneByUser(User user);
}
