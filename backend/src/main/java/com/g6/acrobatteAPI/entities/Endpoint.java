package com.g6.acrobatteAPI.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Id;
import javax.persistence.DiscriminatorType;

import lombok.Data;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "endpoint_type", discriminatorType = DiscriminatorType.STRING)
public class Endpoint {
    @Id
    @GeneratedValue
    private Long endpointId;

    String name;
    Integer x;
    Integer y;

    @ManyToOne(optional = false)
    @JoinColumn(name = "challenge_id")
    Challenge challenge;

    @OneToMany(mappedBy = "start", cascade = CascadeType.MERGE, orphanRemoval = true)
    List<Segment> segmentsStarts;

    @OneToMany(mappedBy = "end", cascade = CascadeType.MERGE, orphanRemoval = true)
    List<Segment> segmentsEnds;

    @JoinTable(name = "endpoint_next", //
            joinColumns = { @JoinColumn(name = "endpoint", referencedColumnName = "endpointId", nullable = false) }, //
            inverseJoinColumns = { @JoinColumn(name = "next", referencedColumnName = "endpointId", nullable = false) })
    @ManyToMany
    Set<Endpoint> next;

    public Endpoint() {
        this.segmentsEnds = new ArrayList<>();
        this.segmentsStarts = new ArrayList<>();
        this.next = new HashSet<>();
    }
}
