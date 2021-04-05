package com.g6.acrobatteAPI.util;

import java.util.ArrayList;
import java.util.List;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.security.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TokenProvider {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public static final String adminEmail = "ilya@gmail.com";
    public static final String userEmail = "ilya2@gmail.com";

    public String getToken(Boolean isAdmin) {
        String email = isAdmin ? adminEmail : userEmail;

        List<Role> roles = new ArrayList<>();
        roles.add(Role.ROLE_ADMIN);
        roles.add(Role.ROLE_CLIENT);
        String token = "Bearer " + jwtTokenProvider.createToken(email, roles);

        return token;
    }
}
