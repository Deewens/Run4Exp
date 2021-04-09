package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserDeleteModel {
    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @ApiModelProperty(value = "Mot de passe de vérification", name = "Mot de passe", dataType = "String", example = "!aaA1234")
    public String password;
}
