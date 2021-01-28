package com.g6.acrobatteAPI.controllers;

import javax.validation.Valid;

import com.g6.acrobatteAPI.dtos.UserDTO;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.security.JwtTokenUtil;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/users")
public class UserController {
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private UserService userService;
    private AuthenticationManager authenticationManager;
    private JwtTokenUtil jwtTokenUtil;

    UserController(UserService userService, AuthenticationManager authenticationManager,
            BCryptPasswordEncoder bCryptPasswordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/signup")
    public UserDTO signup(@Valid @RequestBody UserDTO userDTO) {
        User user = userService.convertToEntity(userDTO);

        String encodedPassword = bCryptPasswordEncoder.encode(userDTO.getPassword());
        user.setPassword(encodedPassword);

        userService.createUser(user);

        UserDTO responseUserDTO = userService.convertToDto(user);

        return responseUserDTO;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid UserDTO userDTO) {
        try {
            Authentication authenticate = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));

            UserDTO userCredentials = (UserDTO) authenticate.getPrincipal();
            User user = userService.convertToEntity(userDTO);

            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, jwtTokenUtil.generateAccessToken(user))
                    .body(userCredentials);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erreur de login");
        }
    }

    @PostMapping("/balbla")
    public String blabla() {

        return "Hello World";
    }
}
