package com.g6.acrobatteAPI.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.g6.acrobatteAPI.entities.events.Event;

import lombok.Data;

@Entity
@Data
public class UserSession {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToOne
    @JoinColumn(name = "challenge_id", referencedColumnName = "id")
    private Challenge challenge;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> events;

    public void addEvent(Event event) {
        events.add(event);
    }

    public UserSession() {
        events = new ArrayList<>();
    }
}
