package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointUpdateModel;

public interface CheckpointService {

    Checkpoint findCheckpoint(Long id);

    void deleteCheckpoint(Long id);

    Checkpoint addCheckpoint(CheckpointCreateModel checkpointCreateModel);

    Checkpoint updateCheckpoint(CheckpointUpdateModel checkpointUpdateModel);
}
