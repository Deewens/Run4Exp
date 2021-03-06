package com.g6.acrobatteAPI.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.g6.acrobatteAPI.entities.events.Event;

import lombok.Data;

@Entity
@Data
public class UserSession implements Serializable {
    private static final long serialVersionUID = 615666250297014930L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToOne
    @JoinColumn(name = "challenge_id", referencedColumnName = "id")
    private Challenge challenge;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<Event> events;

    @Temporal(TemporalType.TIMESTAMP)
    Date inscriptionDate;

    public void addEvent(Event event) {
        events.add(event);
    }

    public UserSession() {
        events = new ArrayList<>();
    }
}
