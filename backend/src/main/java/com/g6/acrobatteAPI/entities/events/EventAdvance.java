package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import lombok.Data;

@Data
@Entity
@DiscriminatorValue("EventAdvance")
public class EventAdvance extends Event {
    // Avancement en kilomètres
    private Double advancement;
}
