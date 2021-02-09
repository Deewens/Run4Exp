package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.Arrays;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
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

    public UserResponseModel convertToResponseModel(User user) {
        UserResponseModel userDTO = modelMapper.map(user, UserResponseModel.class);
        userDTO.setPassword(null);
        return userDTO;
    }
}
