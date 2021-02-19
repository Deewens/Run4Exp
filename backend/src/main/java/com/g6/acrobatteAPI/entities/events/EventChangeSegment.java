package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import com.g6.acrobatteAPI.entities.Segment;

import lombok.Data;

@Entity
@Data
@DiscriminatorValue("EventChangeSegment")
public class EventChangeSegment extends Event {
    @OneToOne
    private Segment passToSegment;
}
