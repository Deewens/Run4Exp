package com.g6.acrobatteAPI.entities;

import java.util.List;

import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;

public class CheckpointFactory {
    public static Checkpoint create(CheckpointCreateModel checkpointCreateModel, Challenge challenge,
            List<Segment> segmentsStarts, List<Segment> segmentsEnds) {
        Checkpoint checkpoint = new Checkpoint();
        checkpoint.setChallenge(challenge);
        checkpoint.setName(checkpointCreateModel.getName());
        checkpoint.setX(checkpointCreateModel.getX());
        checkpoint.setY(checkpointCreateModel.getY());
        checkpoint.setSegmentsStarts(segmentsStarts);
        checkpoint.setSegmentsEnds(segmentsEnds);

        return checkpoint;
    }
}
