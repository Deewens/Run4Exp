package com.g6.acrobatteAPI.models.error;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ErrorMultipleResponseModel {
    private String slug;
    private LocalDateTime timestamp;
    private List<ErrorFieldModel> errors;
    private Integer code;

    public ErrorMultipleResponseModel() {
        errors = new ArrayList<>();
    }
}
