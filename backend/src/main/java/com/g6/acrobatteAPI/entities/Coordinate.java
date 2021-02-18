package com.g6.acrobatteAPI.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Coordinate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    Integer x;
    Integer y;

    public Coordinate() {
        x = 0;
        y = 0;
    }

    public Coordinate(Integer x, Integer y) {
        this.x = x;
        this.y = y;
    }
}
