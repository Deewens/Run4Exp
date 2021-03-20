package com.g6.acrobatteAPI.models.endpoint;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class EndpointModel {

  private String name;

  private CoordinateModel position;
}
