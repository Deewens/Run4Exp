package com.g6.acrobatteAPI.repositories.Event;

import java.util.List;

import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.events.Event;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    public List<Event> findByUserSessionOrderByDate(UserSession userSession);
}
