package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSigninModel {

    @Email(message = "Email doit être valide")
    @NotBlank(message = "Le email ne peut pas être vide")
    @ApiModelProperty(value = "Email pour se connecter", name = "Email", dataType = "String", required = true, example = "ilya@gmail.com")
    private String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @ApiModelProperty(value = "Mot de passe pour se connecter", name = "Mot de passe", dataType = "String", required = true, example = "!aaA1234")
    private String password;

}
