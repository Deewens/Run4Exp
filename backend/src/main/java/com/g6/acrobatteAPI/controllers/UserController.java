package com.g6.acrobatteAPI.controllers;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.security.JwtTokenProvider;
import com.g6.acrobatteAPI.entities.UserFactory;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.hateoas.UserModelAssembler;
import com.g6.acrobatteAPI.models.user.UserDeleteModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.models.user.UserSigninModel;
import com.g6.acrobatteAPI.models.user.UserSignupModel;
import com.g6.acrobatteAPI.models.user.UserStatisticsModel;
import com.g6.acrobatteAPI.models.user.UserUpdateModel;
import com.g6.acrobatteAPI.services.UserService;

import org.modelmapper.ModelMapper;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import io.swagger.annotations.ApiOperation;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/api/users")
@Api(value = "API REST sur L'Utilisateur", description = "API REST sur L'Utilisateur", tags = "User")
public class UserController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserModelAssembler modelAssembler;
    private final AuthenticationFacade authenticationFacade;
    private final ModelMapper modelMapper;

    @ApiOperation(value = "Récupérer l'Utilisateur par ID", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 400, message = "idNotFound - User"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found") //
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseModel> getUser(@PathVariable("id") Long id) throws ApiIdNotFoundException {
        User user = userRepository.findById(id).orElseThrow(() -> new ApiIdNotFoundException("User", id));

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(userResponse);
    }

    @ApiOperation(value = "Récupérer soi-même", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found") //
    })
    @GetMapping("/self")
    public ResponseEntity<EntityModel<UserResponseModel>> getSelf() throws ApiNoUserException, ApiIdNotFoundException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.getUserByEmail(email);

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(modelAssembler.toModel(userResponse, true));
    }

    @ApiOperation(value = "Créer un comptre", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found") //
    })
    @PostMapping("/signup")
    public ResponseEntity<UserResponseModel> signup(@RequestBody @Valid UserSignupModel userSignupModel) {
        User user = UserFactory.create(userSignupModel);
        userService.createUser(user);
        UserResponseModel userResponseModel = userService.convertToResponseModel(user);

        return new ResponseEntity<UserResponseModel>(userResponseModel, HttpStatus.OK);
    }

    @ApiOperation(value = "Se connecter", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found") //
    })
    @PostMapping("/signin")
    public ResponseEntity<EntityModel<UserResponseModel>> signin(@RequestBody @Valid UserSigninModel userSigninModel)
            throws ApiNoUserException, ApiIdNotFoundException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userSigninModel.getEmail(), userSigninModel.getPassword()));

        User user = userRepository.findByEmail(userSigninModel.getEmail())
                .orElseThrow(() -> new IllegalArgumentException());

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        String token = jwtTokenProvider.createToken(userSigninModel.getEmail(), user.getRoles());

        userResponse.setToken(token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", token);

        return ResponseEntity.ok().headers(headers).body(modelAssembler.toModel(userResponse, true));
    }

    @ApiOperation(value = "Update son compte", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found") //
    })
    @PutMapping("/self")
    public ResponseEntity<EntityModel<UserResponseModel>> updateSelf(
            @RequestBody @Valid UserUpdateModel userUpdateModel) throws ApiNoUserException, ApiIdNotFoundException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.updateUser(email, userUpdateModel);

        UserResponseModel userResponse = userService.convertToResponseModel(user);

        return ResponseEntity.ok().body(modelAssembler.toModel(userResponse, true));
    }

    @ApiOperation(value = "Supprimer son compte", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
            @ApiResponse(code = 400, message = "noErrorMapping - Mot de passe incorrect") //
    })
    @DeleteMapping("/self")
    public ResponseEntity<String> deleteSelf(@RequestBody @Valid UserDeleteModel userDeleteModel)
            throws ApiNoUserException {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        userService.deleteUser(email, userDeleteModel);

        return ResponseEntity.ok("Compte supprimé");
    }

    @ApiOperation(value = "Changer l'avatar sur son compte", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
    })
    @PutMapping("/avatar")
    public ResponseEntity<Object> handleFileUpload(@RequestParam("file") MultipartFile file) throws ApiNoUserException {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.getUserByEmail(email);

        if (file.getSize() > 4000000) {
            return ResponseEntity.badRequest().body(null);
        }

        try {

            user.setAvatar(file.getBytes());

            userRepository.save(user);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e);
        }

        return ResponseEntity.ok().body(null);
    }

    @ApiOperation(value = "Récupérer l'avatar sur son compte", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
    })
    @GetMapping(value = "/avatar", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getAvatar() throws ApiNoUserException {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.getUserByEmail(email);

        return user.getAvatar();
    }

    @ApiOperation(value = "Récupérer l'avatar sur son compte en base64", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
    })
    @GetMapping(value = "/avatar", params = "base64=true")
    public @ResponseBody String getAvatarBase64() throws ApiNoUserException {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();

        User user = userService.getUserByEmail(email);

        byte[] avatarBytes = user.getAvatar();
        if (avatarBytes == null)
            return null;

        String avatarBase64 = Base64.getEncoder().encodeToString(avatarBytes);

        return avatarBase64;
    }

    @ApiOperation(value = "Récupérer les statistiques de l'utilisateur", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
    })
    @GetMapping(value = "/statistics")
    public @ResponseBody ResponseEntity<UserStatisticsModel> getUserStatistics() throws ApiNoUserException {

        User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

        UserStatisticsModel model = userService.calculateUserStatistics(user);

        return ResponseEntity.ok().body(model);
    }

    @ApiOperation(value = "Récupérer les statistiques de l'utilisateur", response = Iterable.class, tags = "User")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 403, message = "Forbidden"), //
            @ApiResponse(code = 404, message = "Not found"), //
    })
    @GetMapping(value = "/superadmins")
    public @ResponseBody ResponseEntity<List<UserResponseModel>> getSuperadmins()
            throws ApiNoUserException, ApiNotAdminException {
        User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

        if (!user.isAdmin()) {
            throw new ApiNotAdminException(user.getEmail());
        }

        List<User> admins = userRepository.findAllByRoles(Role.ROLE_ADMIN);
        List<UserResponseModel> adminModels = admins.stream()
                .map(userLamba -> modelMapper.map(userLamba, UserResponseModel.class)).collect(Collectors.toList());

        return ResponseEntity.ok().body(adminModels);
    }
}
