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
    List<Long> segmentsStartsIds;
    List<Long> segmentsEndsIds;
    String checkpointType;
    List<Integer> nextIds;
}
