package com.g6.acrobatteAPI.entities;

import javax.persistence.Entity;

import lombok.Data;

@Data
@Entity
public class Obstacle extends Endpoint {
    String riddle;
}
