package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.Arrays;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.user.UserDeleteModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.models.user.UserUpdateModel;
import com.g6.acrobatteAPI.models.validators.ValidPassword;
import com.g6.acrobatteAPI.repositories.UserRepository;

import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public void signup(User user) {
        userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public void createUser(User user) {
        try {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            user.setRoles(new ArrayList<Role>(Arrays.asList(Role.ROLE_CLIENT, Role.ROLE_ADMIN)));
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Le email existe déjà");
        }
    }

    public User updateUser(String email, UserUpdateModel userUpdateModel) {
        User user = userRepository.findByEmail(email).get();

        if (!passwordEncoder.matches(userUpdateModel.password, user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }

        user.setFirstName(userUpdateModel.firstName);
        user.setName(userUpdateModel.name);

        if (userUpdateModel.newPassword != null && userUpdateModel.newPasswordConfirmation != null) {

            if (!userUpdateModel.newPassword.equals(userUpdateModel.newPasswordConfirmation)) {
                throw new IllegalArgumentException(
                        "Le mot de passe de confirmation doit correspondre au nouveau mot de passe.");
            }

            @ValidPassword
            String validPassword = userUpdateModel.newPassword;
            String encodedPassword = passwordEncoder.encode(validPassword);

            user.setPassword(encodedPassword);
        }

        userRepository.save(user);

        return user;
    }

    public UserResponseModel convertToResponseModel(User user) {
        UserResponseModel userDTO = modelMapper.map(user, UserResponseModel.class);

        userDTO.setPassword(null);

        return userDTO;
    }

    public void deleteUser(String email, UserDeleteModel userDeleteModel) {
        User user = userRepository.findByEmail(email).get();

        try {
            String encodedPassword = user.getPassword();

            if (!passwordEncoder.matches(userDeleteModel.password, encodedPassword)) {
                throw new IllegalArgumentException("Mot de passe incorrect");
            }

            userRepository.delete(user);

        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }
    }
}
