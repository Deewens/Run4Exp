package com.g6.acrobatteAPI.security;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import com.g6.acrobatteAPI.entities.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import com.g6.acrobatteAPI.entities.Role;

public interface IAuthenticationFacade {
    Authentication getAuthentication();

    public Optional<User> getUser();

    public UserDetails getPrincipal();

    public List<Role> getUserRoles();
}