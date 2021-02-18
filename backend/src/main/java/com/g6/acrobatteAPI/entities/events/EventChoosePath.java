package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

import com.g6.acrobatteAPI.entities.Segment;

import lombok.Data;

@Data
@Entity
@DiscriminatorValue("EventChoosePath")
public class EventChoosePath extends Event {
    @OneToOne
    private Segment segmentToChoose;
}
