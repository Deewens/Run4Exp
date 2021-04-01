package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointUpdateModel;

public interface CheckpointServiceI {
    public Checkpoint findCheckpoint(Long id) throws ApiIdNotFoundException;

    public void deleteCheckpoint(Long id) throws ApiIdNotFoundException;

    public Checkpoint save(Checkpoint checkpoint);

    public Checkpoint createCheckpoint(CheckpointCreateModel checkpointCreateModel) throws ApiIdNotFoundException;

    public Checkpoint updateCheckpoint(Checkpoint checkpoint, CheckpointUpdateModel checkpointUpdateModel) throws ApiIdNotFoundException, ApiWrongParamsException;

    public Checkpoint reposition(Checkpoint checkpoint, Coordinate newPosition) throws ApiWrongParamsException;

    public Long delete(Checkpoint checkpoint);
}