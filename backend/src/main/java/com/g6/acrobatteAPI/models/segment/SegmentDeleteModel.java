package com.g6.acrobatteAPI.models.segment;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class SegmentDeleteModel {
    @NotNull(message = "Vous devez précisez le id du segment")
    @Positive(message = "L'id du segment doit être positive")
    private Long segmentId;
}
