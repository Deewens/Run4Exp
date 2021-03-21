package com.g6.acrobatteAPI.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Entity
@Data
public class Obstacle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    String riddle;

    Double position;

    @ManyToOne(optional = false)
    @JoinColumn(name = "segment_id")
    Segment segment;

    public Obstacle() {
    }

    public Obstacle(String riddle, Double position, Segment segment) {
        this.riddle = riddle;
        this.position = position;
        this.segment = segment;
    }
}
