package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
@Entity
@DiscriminatorValue("EventAdvance")
public class EventAdvance extends Event {
    // Avancement en kilomètres
    @NotNull
    @Positive
    private Double advancement;
}
