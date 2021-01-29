package com.g6.acrobatteAPI.controllers;

import javax.validation.Valid;

import com.g6.acrobatteAPI.dtos.UserDTO;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.security.JwtTokenProvider;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/users")
public class UserController {
    // private BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    UserController(UserService userService, AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userService = userService;
        // this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody @Valid UserDTO userDTO) {
        User user = userService.convertToEntity(userDTO);
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        user.setPassword(encodedPassword);

        userService.createUser(user);

        userDTO = userService.convertToDto(user);

        return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public String signin(@Valid @RequestBody UserDTO userDTO) {
        // User user = userService.convertToEntity(userDTO);

        // String encodedPassword = bCryptPasswordEncoder.encode(userDTO.getPassword());
        // user.setPassword(encodedPassword);

        // userService.createUser(user);

        // UserDTO responseUserDTO = userService.convertToDto(user);

        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));
        return jwtTokenProvider.createToken(userDTO.getEmail(),
                userRepository.findByEmail(userDTO.getEmail()).get().getRoles());
    }

    @PostMapping("/balbla")
    public String blabla() {

        return "Hello World";
    }
}
