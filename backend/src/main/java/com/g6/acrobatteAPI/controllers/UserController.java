package com.g6.acrobatteAPI.controllers;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.security.JwtTokenProvider;
import com.g6.acrobatteAPI.entities.UserFactory;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.models.user.UserSigninModel;
import com.g6.acrobatteAPI.models.user.UserSignupModel;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/users")
public class UserController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    UserController(UserService userService, AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponseModel> signup(@RequestBody @Valid UserSignupModel userSignupModel) {
        User user = UserFactory.create(userSignupModel);
        userService.createUser(user);
        UserResponseModel userResponseModel = userService.convertToResponseModel(user);

        return new ResponseEntity<UserResponseModel>(userResponseModel, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<UserResponseModel> signin(@RequestBody @Valid UserSigninModel userSigninModel) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userSigninModel.getEmail(), userSigninModel.getPassword()));

        User user = userRepository.findByEmail(userSigninModel.getEmail()).get();

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        String token = jwtTokenProvider.createToken(userSigninModel.getEmail(),
                userRepository.findByEmail(userSigninModel.getEmail()).get().getRoles());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", token);

        return ResponseEntity.ok().headers(headers).body(userResponse);
    }
}
