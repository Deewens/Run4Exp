package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class UserSigninModel {

    @Email(message = "Email doit être valide")
    @NotBlank(message = "Le email ne peut pas être vide")
    public String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    public String password;

}
