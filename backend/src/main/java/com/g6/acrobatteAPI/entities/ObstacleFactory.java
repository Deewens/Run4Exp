package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.obstacle.ObstacleCreateModel;

public class ObstacleFactory {
    public static Obstacle create(ObstacleCreateModel obstacleCreateModel, Segment segment) {
        return new Obstacle(obstacleCreateModel.getRiddle(), obstacleCreateModel.getResponse(),
                obstacleCreateModel.getPosition(), segment);
    }
}
