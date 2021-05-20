package com.g6.acrobatteAPI.models.userSession;

import java.util.Date;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSessionRunModel {
    private Long userSessionId;
    private Date startDate;
    private Date endDate;
    private Double advancement;
}
