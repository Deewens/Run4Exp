package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointUpdateModel;

public interface CheckpointServiceI {
    public Checkpoint findCheckpoint(Long id);

    public void deleteCheckpoint(Long id);

    public Checkpoint save(Checkpoint checkpoint);

    public Checkpoint createCheckpoint(CheckpointCreateModel checkpointCreateModel);

    public Checkpoint updateCheckpoint(Checkpoint checkpoint, CheckpointUpdateModel checkpointUpdateModel);

    public Checkpoint reposition(Checkpoint checkpoint, Coordinate newPosition);

    public Long delete(Checkpoint checkpoint);
}