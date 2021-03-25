package com.g6.acrobatteAPI;

import com.g6.acrobatteAPI.entities.Coordinate;

public class Util {
    public static Double calculateLengthBetweenPoints(Coordinate point1, Coordinate point2) {
        Double xLength = point2.getX() - point1.getX();
        Double yLenght = point2.getY() - point1.getY();

        return (Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLenght, 2)));
    }
}
