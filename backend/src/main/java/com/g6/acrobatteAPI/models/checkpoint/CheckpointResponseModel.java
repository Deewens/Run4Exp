package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;
import lombok.Data;

@Data
public class CheckpointResponseModel {
    Integer id;
    String name;
    Double x;
    Double y;
    Integer challengeId;
    List<Integer> segmentsStartsIds;
    List<Integer> segmentsEndsIds;
    String checkpointType;
    List<Integer> nextIds;
}
