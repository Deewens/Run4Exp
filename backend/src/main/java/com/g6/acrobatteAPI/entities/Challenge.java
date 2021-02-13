package com.g6.acrobatteAPI.entities;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(exclude = "administrators")
@Entity
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String description;

    private double scale;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "challenge_administrators", //
            joinColumns = @JoinColumn(name = "administrator_id", referencedColumnName = "id"), //
            inverseJoinColumns = @JoinColumn(name = "challenge_id", referencedColumnName = "id"))
    private Set<User> administrators;

    @OneToMany(cascade = CascadeType.MERGE, orphanRemoval = true)
    private Set<Endpoint> endpoints;

    public Challenge() {
        administrators = new HashSet<>();
        endpoints = new HashSet<>();
    }

    public Challenge(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        administrators = new HashSet<>();
        endpoints = new HashSet<>();
    }

    public Challenge(String name, String description) {
        this.name = name;
        this.description = description;
        administrators = new HashSet<>();
        endpoints = new HashSet<>();
    }

    public void addAdministrator(User admin) {
        administrators.add(admin);
        admin.getAdministeredChallenges().add(this);
    }

    public void removeAdministrator(User admin) {
        if (!administrators.contains(admin))
            throw new IllegalArgumentException("L'administrateur ne fait pas partie du challenge");

        if (!admin.getAdministeredChallenges().contains(this))
            throw new IllegalArgumentException("L'administrateur ne fait pas partie du challenge");

        administrators.remove(admin);
        admin.getAdministeredChallenges().add(this);
    }

    public List<Long> getAdministratorsId() {
        return administrators.stream().map(User::getId).collect(Collectors.toList());
    }
}
