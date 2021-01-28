package com.g6.acrobatteAPI.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;

    public Challenge() {
    }

    public Challenge(long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
