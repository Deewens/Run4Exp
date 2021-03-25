package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.g6.acrobatteAPI.models.validators.ValidPassword;

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

    @NotBlank(message = "Le mot de passe actuel ne peut pas être vide")
    public String password;

    @NotBlank(message = "Le nouveau mot de passe ne peut pas être vide")
    @ValidPassword(message = "Le nouveau mot de passe ne corresponds pas aux délimitations")
    public String newPassword;

    @NotBlank(message = "La confirmation du nouveau mot de passe ne peut pas être vide")
    @ValidPassword(message = "La confirmation du nouveau mot de passe ne corresponds pas aux délimitations")
    public String newPasswordConfirmation;
}
