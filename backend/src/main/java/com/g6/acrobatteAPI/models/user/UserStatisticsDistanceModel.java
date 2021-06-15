package com.g6.acrobatteAPI.models.user;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.g6.acrobatteAPI.models.validators.ValidPassword;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserStatisticsDistanceModel {
    LocalDate day;
    Double distance;

    public Double addDistance(Double distanceToAdd) {
        return distance += distanceToAdd;
    }
}
