package com.g6.acrobatteAPI.entities;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.JoinColumn;

import lombok.Data;

@Data
@Entity
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;

    @ManyToMany
    @JoinTable(name = "challenge_administrators", //
            joinColumns = @JoinColumn(name = "administrator_id", referencedColumnName = "id"), //
            inverseJoinColumns = @JoinColumn(name = "challenge_id", referencedColumnName = "id"))
    private Set<User> administrators;

    public Challenge() {
        administrators = new HashSet<>();
    }

    public Challenge(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        administrators = new HashSet<>();
    }

    public Challenge(String name, String description) {
        this.name = name;
        this.description = description;
        administrators = new HashSet<>();
    }

    public List<Long> getAdministratorsId() {
        return administrators.stream().map(User::getId).collect(Collectors.toList());
    }
}
