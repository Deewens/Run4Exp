package com.g6.acrobatteAPI.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import javax.persistence.JoinColumn;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;

    private String name;

    @Lob
    private String description;

    private String shortDescription;

    private double scale;

    private Boolean published;

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(name = "challenge_administrators", //
            joinColumns = @JoinColumn(name = "challenge_id", referencedColumnName = "id"), //
            inverseJoinColumns = @JoinColumn(name = "administrator_id", referencedColumnName = "id"))
    private Set<User> administrators;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creatorId")
    private User creator;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Checkpoint> checkpoints;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Segment> segments;

    @Lob
    private byte[] background;

    public Challenge() {
        administrators = new HashSet<>();
        checkpoints = new HashSet<>();
        segments = new HashSet<>();
    }

    public Challenge(Long id, String name, String description, String shortDescription) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;

        administrators = new HashSet<>();
        checkpoints = new HashSet<>();
    }

    public Challenge(String name, String description, String shortDescription, Double scale, Boolean published) {
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.scale = scale;
        this.published = published;
        administrators = new HashSet<>();
        checkpoints = new HashSet<>();
        segments = new HashSet<>();
    }

    public void addCheckpoint(Checkpoint checkpoint) {
        this.getCheckpoints().add(checkpoint);
        checkpoint.setChallenge(this);
    }

    public void removeEndpoint(Checkpoint checkpoint) {
        this.getCheckpoints().remove(checkpoint);
        checkpoint.setChallenge(null);
    }

    public void addSegment(Segment segment) {
        this.getSegments().add(segment);
        segment.setChallenge(this);
    }

    public void removeSegment(Segment segment) {
        this.getCheckpoints().remove(segment);
        segment.setChallenge(null);
    }

    /**
     * Renvoie le endpoint initial (normalement: le premier checkpoint de start)
     */
    public Optional<Checkpoint> getFirstCheckpoint() {
        // Trouver tous les endpoints qui ne commencent par aucun segment
        List<Checkpoint> startCheckpoints = checkpoints.stream()
                .filter(endpoint -> endpoint.getSegmentsEnds().size() == 0).collect(Collectors.toList());

        if (startCheckpoints.size() == 0) {
            return Optional.empty();
        }

        return Optional.of(startCheckpoints.get(0));
    }

    /**
     * Renvoie le endpoint fina (normalement: le dernier checkpoint de finish)
     */
    public Checkpoint getLastCheckpoint() {
        // Trouver tous les endpoints qui ne finissent par aucun segment
        List<Checkpoint> finishCheckpoints = checkpoints.stream()
                .filter(endpoint -> endpoint.getSegmentsStarts().size() == 0).collect(Collectors.toList());

        return finishCheckpoints.get(0);
    }

    public void addAdministrator(User admin) {
        administrators.add(admin);
        admin.getAdministeredChallenges().add(this);
    }

    public void removeAdministrator(User admin) {
        administrators.remove(admin);
        admin.getAdministeredChallenges().remove(this);
    }

    public Set<Long> getAdministratorsId() {
        return administrators.stream().map(User::getId).collect(Collectors.toSet());
    }

    public Set<Long> getCheckpointsId() {
        return getCheckpoints().stream().map(Checkpoint::getId).collect(Collectors.toSet());
    }

    public Set<Long> getSegmentsId() {
        return getSegments().stream().map(Segment::getId).collect(Collectors.toSet());
    }
}
