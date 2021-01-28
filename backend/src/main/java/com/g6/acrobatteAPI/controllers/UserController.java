package com.g6.acrobatteAPI.controllers;

import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.UserRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/user")
public class UserController {
    private final UserRepository userRepository;

    UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping()
    public User getUser() {
        User user = new User("Ukhanov", "Ilya", "ilya@gmail.com");
        userRepository.save(user);

        return user;
    }
}
