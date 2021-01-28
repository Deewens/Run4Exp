package com.g6.acrobatteAPI.repositories;

import java.util.Optional;

import com.g6.acrobatteAPI.entities.User;

public interface UserCustomRepository {
    public Optional<User> findByEmail(String email);
}
