package com.g6.acrobatteAPI.models.user;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.g6.acrobatteAPI.models.validators.ValidPassword;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserStatisticsModel {
    private Double totalDistance;
    private Long totalTime;
    private int ongoingChallenges;
    private int finishedChallenges;
    private int abandonnedChallenges;
    private List<UserStatisticsDistanceModel> dailyDistance;
}
