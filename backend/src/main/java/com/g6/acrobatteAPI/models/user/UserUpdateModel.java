package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserUpdateModel {
    @Email(message = "Email doit être valide")
    @NotBlank(message = "Le email ne peut pas être vide")
    public String email;

    @NotBlank(message = "Le prénom ne peut pas être vide")
    public String firstName;

    @NotBlank(message = "Le nom ne peut pas être vide")
    public String name;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    public String password;

    public String newPassword;

    public String newPasswordConfirmation;
}
