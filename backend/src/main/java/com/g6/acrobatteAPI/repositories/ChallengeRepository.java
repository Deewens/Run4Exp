package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.Challenge;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

}
