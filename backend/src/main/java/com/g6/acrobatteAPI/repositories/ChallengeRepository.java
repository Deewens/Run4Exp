package com.g6.acrobatteAPI.repositories;

import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.models.challenge.ChallengeDetailProjection;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ChallengeRepository extends PagingAndSortingRepository<Challenge, Long> {

    ChallengeDetailProjection findDetailById(Long id);

}
