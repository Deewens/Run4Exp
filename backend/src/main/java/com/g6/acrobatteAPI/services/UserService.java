package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.Arrays;

import com.g6.acrobatteAPI.dtos.UserDTO;
import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.repositories.UserRepository;

import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.expression.ParseException;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    UserRepository userRepository;
    ModelMapper modelMapper;

    public UserService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public void signup(User user) {
        userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    public void createUser(User user) {
        try {
            user.setRoles(new ArrayList<Role>(Arrays.asList(Role.ROLE_CLIENT)));
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
