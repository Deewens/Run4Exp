package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.entities.CheckpointType;
import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class CheckpointUpdateModel {

    private Long challengeId;

    private CheckpointType checkpointType;

    private CoordinateModel position;

    String name;
}
