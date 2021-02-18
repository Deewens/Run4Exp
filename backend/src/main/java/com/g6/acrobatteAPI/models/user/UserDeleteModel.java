package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserDeleteModel {
    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    public String password;
}
