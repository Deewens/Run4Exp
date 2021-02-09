package com.g6.acrobatteAPI.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Data;

@Entity
@Data
@DiscriminatorValue("Checkpoint")
public class Checkpoint extends Endpoint {

    @Enumerated(EnumType.STRING)
    CheckpointTypeEnum checkpointType;
}
