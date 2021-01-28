package com.g6.acrobatteAPI.dtos;

import java.util.Collection;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
public class UserDTO implements UserDetails {
    private static final long serialVersionUID = 1L;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
