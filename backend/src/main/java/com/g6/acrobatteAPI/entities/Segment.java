package com.g6.acrobatteAPI.entities;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.GenerationType;

import lombok.Data;

@Entity
@Data
public class Segment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "start_id")
    private Endpoint start;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "end_id")
    private Endpoint end;

    private String name;
}
