package com.g6.acrobatteAPI.entities;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String firstName;
    private String email;

    public User() {
    }

    public User(long id, String name, String firstName, String email) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.email = email;
    }
}
