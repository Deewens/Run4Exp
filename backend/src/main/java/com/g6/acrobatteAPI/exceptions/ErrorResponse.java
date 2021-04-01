package com.g6.acrobatteAPI.exceptions;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
    private String slug;
    private LocalDateTime timestamp;
    private String error;
    private Integer code;
}
