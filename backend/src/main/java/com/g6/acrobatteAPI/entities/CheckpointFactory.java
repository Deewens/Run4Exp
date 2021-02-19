package com.g6.acrobatteAPI.entities;

import java.util.List;

import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointModel;

public class CheckpointFactory {
    public static Checkpoint create(CheckpointCreateModel checkpointCreateModel, Challenge challenge,
            List<Segment> segmentsStarts, List<Segment> segmentsEnds) {
        Checkpoint checkpoint = new Checkpoint();
        checkpoint.setChallenge(challenge);
        checkpoint.setName(checkpointCreateModel.getName());
        checkpoint.getPosition().setX(checkpointCreateModel.getX());
        checkpoint.getPosition().setY(checkpointCreateModel.getY());
        checkpoint.setCheckpointType(checkpointCreateModel.getCheckpointType());
        checkpoint.setSegmentsStarts(segmentsStarts);
        checkpoint.setSegmentsEnds(segmentsEnds);

        return checkpoint;
    }

    public static Checkpoint create(CheckpointModel checkpointModel, Challenge challenge) {
        Checkpoint checkpoint = new Checkpoint();

        checkpoint.setChallenge(challenge);
        checkpoint.setName(checkpointModel.getName());
        checkpoint.getPosition().setX(checkpointModel.getPosition().getX());
        checkpoint.getPosition().setY(checkpointModel.getPosition().getY());

        return checkpoint;
    }
}
