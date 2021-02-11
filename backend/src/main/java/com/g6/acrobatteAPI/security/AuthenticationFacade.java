package com.g6.acrobatteAPI.security;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationFacade implements IAuthenticationFacade {

    private final UserRepository userRepository;

    @Override
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Override
    public Principal getPrincipal() {
        return (Principal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @Override
    public Optional<User> getUser() {
        Principal principal = this.getPrincipal();
        return userRepository.findByEmail(principal.getName());
    }

    @Override
    public List<Role> getUserRoles() {
        return (List<Role>) this.getAuthentication().getAuthorities();
    }
}