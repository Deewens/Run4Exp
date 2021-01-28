package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.dtos.UserDTO;
import com.g6.acrobatteAPI.entities.User;
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
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Le email existe déjà");
        }
    }

    public UserDTO convertToDto(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setPassword(null);
        return userDTO;
    }

    public User convertToEntity(UserDTO userDTO) throws ParseException {
        User user = modelMapper.map(userDTO, User.class);
        user.setPassword(null);
        return user;
    }
}
