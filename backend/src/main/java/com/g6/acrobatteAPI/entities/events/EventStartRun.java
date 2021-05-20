package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import lombok.Data;

@Entity
@DiscriminatorValue("EventEndRun")
public class EventStartRun extends Event {
}
