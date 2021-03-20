package com.g6.acrobatteAPI.models.coordinate;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class CoordinateModel {

  @NotNull(message = "Vous devez précisez la coordonnée X")
  @Positive(message = "Coordonnée X doit être positive")
  private Double x;

  @NotNull(message = "Vous devez précisez la coordonnée Y")
  @Positive(message = "Coordonnée Y doit être positive")
  private Double y;

}
