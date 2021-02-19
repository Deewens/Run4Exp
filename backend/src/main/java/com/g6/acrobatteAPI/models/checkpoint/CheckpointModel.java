package com.g6.acrobatteAPI.models.checkpoint;

import com.g6.acrobatteAPI.entities.CheckpointType;
import com.g6.acrobatteAPI.models.endpoint.EndpointModel;

import lombok.Data;

@Data
public class CheckpointModel extends EndpointModel {

    private CheckpointType type;

}
