package com.g6.acrobatteAPI.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.GenerationType;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Segment {
    @Id
    @EqualsAndHashCode.Include()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Coordinate> coordinates;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "start_id")
    private Endpoint start;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "end_id")
    private Endpoint end;

    private double length;

    private String name;

    public Segment() {
        coordinates = new ArrayList<>();
    }

    public void addCoordinate(Coordinate coordinate) {
        coordinates.add(coordinate);
    }
}
