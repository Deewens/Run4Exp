package com.g6.acrobatteAPI.repositories;

import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ChallengeRepository extends PagingAndSortingRepository<Challenge, Long> {

    Optional<Challenge> findDetailById(Long id);

}
