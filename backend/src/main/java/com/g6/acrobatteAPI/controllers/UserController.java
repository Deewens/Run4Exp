package com.g6.acrobatteAPI.controllers;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.security.JwtTokenProvider;
import com.g6.acrobatteAPI.entities.UserFactory;
import com.g6.acrobatteAPI.hateoas.UserModelAssembler;
import com.g6.acrobatteAPI.models.user.UserDeleteModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.models.user.UserSigninModel;
import com.g6.acrobatteAPI.models.user.UserSignupModel;
import com.g6.acrobatteAPI.models.user.UserUpdateModel;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping(value = "/users")
public class UserController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserModelAssembler modelAssembler;

    UserController(UserService userService, AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider, UserRepository userRepository, UserModelAssembler modelAssembler) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.modelAssembler = modelAssembler;
    }

    @GetMapping("/{id}") // TODO: Vérifier les permissions ou changer les infos du retour
    public ResponseEntity<UserResponseModel> getUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id).get();

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(userResponse);
    }

    @GetMapping("/self")
    public ResponseEntity<EntityModel<UserResponseModel>> getSelf() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.getUserByEmail(email);

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(modelAssembler.toModel(userResponse, true));
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponseModel> signup(@RequestBody @Valid UserSignupModel userSignupModel) {
        User user = UserFactory.create(userSignupModel);
        userService.createUser(user);
        UserResponseModel userResponseModel = userService.convertToResponseModel(user);

        return new ResponseEntity<UserResponseModel>(userResponseModel, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<EntityModel<UserResponseModel>> signin(@RequestBody @Valid UserSigninModel userSigninModel) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userSigninModel.getEmail(), userSigninModel.getPassword()));

        User user = userRepository.findByEmail(userSigninModel.getEmail()).get();

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        String token = jwtTokenProvider.createToken(userSigninModel.getEmail(),
                userRepository.findByEmail(userSigninModel.getEmail()).get().getRoles());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", token);

        return ResponseEntity.ok().headers(headers).body(modelAssembler.toModel(userResponse, true));
    }

    @PutMapping("/self")
    public ResponseEntity<EntityModel<UserResponseModel>> updateSelf(
            @RequestBody @Valid UserUpdateModel userUpdateModel) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.updateUser(email, userUpdateModel);

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(modelAssembler.toModel(userResponse, true));
    }

    @DeleteMapping("/self")
    public ResponseEntity<String> deleteSelf(@RequestBody @Valid UserDeleteModel userDeleteModel) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        userService.deleteUser(email, userDeleteModel);

        return ResponseEntity.ok("Compte supprimé");
    }

}
