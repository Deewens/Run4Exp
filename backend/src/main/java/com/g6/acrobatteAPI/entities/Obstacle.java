package com.g6.acrobatteAPI.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Obstacle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    String riddle;
}
