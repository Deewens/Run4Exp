package com.g6.acrobatteAPI.models.user;

import lombok.Data;

@Data
public class UserResponseModel {
    private long id;
    private String name;
    private String firstName;
    private String email;
    private String token;
}
