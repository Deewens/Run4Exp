package com.g6.acrobatteAPI.entities;

public enum CheckpointType {
    BEGIN, MIDDLE, END;

    // @JsonCreator
    // public static CheckpointType decode(final String code) {
    // switch (code) {
    // case "BEGIN":
    // return CheckpointType.values()[0];

    // case "MIDDLE":
    // return CheckpointType.values()[1];

    // case "END":
    // return CheckpointType.values()[2];
    // default:
    // break;
    // }
    // }
}
