package com.g6.acrobatteAPI.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.JoinColumn;

import lombok.Data;

@Data
@Entity
public class Coordinate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "challenge_administrators", //
            joinColumns = @JoinColumn(name = "administrator_id", referencedColumnName = "id"), //
            inverseJoinColumns = @JoinColumn(name = "challenge_id", referencedColumnName = "id"))
    private Set<User> administrators;

    @OneToMany(cascade = CascadeType.MERGE, orphanRemoval = true)
    private Set<Endpoint> endpoints;

    public Coordinate() {
        administrators = new HashSet<>();
        endpoints = new HashSet<>();
    }

}
