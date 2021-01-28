package com.g6.acrobatteAPI.security;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.g6.acrobatteAPI.dtos.UserDTO;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final UserService serviceUser;

    public JwtTokenFilter(JwtTokenUtil jwtTokenUtil, UserRepository userRepository, UserService serviceUser) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
        this.serviceUser = serviceUser;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // Get authorization header and validate
        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || header.isEmpty() || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // Get jwt token and validate
        final String token = header.split(" ")[1].trim();
        if (!jwtTokenUtil.validate(token)) {
            chain.doFilter(request, response);
            return;
        }

        // Get user identity and set it on the spring security context
        Optional<User> result = userRepository.findByEmail(jwtTokenUtil.getEmail(token));
        if (result.isEmpty()) {
            chain.doFilter(request, response);
        }

        User user = result.get();
        UserDTO userDTO = serviceUser.convertToDto(user);
        userDTO.setId(user.getId());

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDTO, null);
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request, response);
    }

}