package com.g6.acrobatteAPI.models.user;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.g6.acrobatteAPI.models.validators.ValidPassword;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserUpdateModel {
    @Email(message = "Email doit être valide")
    @ApiModelProperty(value = "Email", name = "Email", dataType = "String", required = true, example = "ilya@gmail.com")
    public String email;

    @ApiModelProperty(value = "Prénom", name = "Prénom", dataType = "String", required = true, example = "Ilya")
    public String firstName;

    @ApiModelProperty(value = "Nom de famille", name = "Nom de famille", dataType = "String", required = true, example = "Ukhanov")
    public String name;

    @ApiModelProperty(value = "Mot de passe", name = "Mot de passe", dataType = "String", required = true, example = "!aaA1234")
    public String password;
    
    @ValidPassword(message = "Le nouveau mot de passe ne corresponds pas aux délimitations")
    public String newPassword;

    @ValidPassword(message = "La confirmation du nouveau mot de passe ne corresponds pas aux délimitations")
    @ApiModelProperty(value = "Mot de passe de confirmation", name = "Mot de passe de confirmation", dataType = "String", required = true, example = "!aaA1234")
    public String newPasswordConfirmation;
}
