package com.g6.acrobatteAPI.entities.events;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

import com.g6.acrobatteAPI.entities.Obstacle;

import lombok.Data;

@Data
@Entity
@DiscriminatorValue("EventPassObstacle")
public class EventPassObstacle extends Event {
    @OneToOne
    private Obstacle obstacleToPass;
}
