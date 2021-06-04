package com.g6.acrobatteAPI.models.user;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserResponseModel {
    @ApiModelProperty(value = "Id de l'utilisateur", name = "Id de l'utilisateur", dataType = "Long", example = "1")
    private long id;

    @ApiModelProperty(value = "Nom de famille de l'utilisateur", name = "Nom de famille de l'utilisateur", dataType = "String", example = "Ukhanov")
    private String name;

    @ApiModelProperty(value = "Prénom de l'utilisateur", name = "Prénom de l'utilisateur", dataType = "String", example = "Ilya")
    private String firstName;

    @ApiModelProperty(value = "Email de l'utilisateur", name = "Email de l'utilisateur", dataType = "String", example = "ilya@gmail.com")
    private String email;

    @ApiModelProperty(value = "JWToken de connection", name = "JWToken de connection", dataType = "String")
    private String token;
    
    private Boolean superAdmin;
}
