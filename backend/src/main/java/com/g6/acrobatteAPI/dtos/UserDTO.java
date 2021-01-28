package com.g6.acrobatteAPI.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;

    @NotBlank(message = "Le nom ne peut pas être vide")
    private String name;

    @NotBlank(message = "Le prénom ne peut pas être vide")
    private String firstName;

    @Email(message = "Email doit être valide")
    @NotBlank(message = "Le email ne peut pas être vide")
    private String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    private String password;
}
