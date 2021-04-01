package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.projections.challenge.ChallengeAdministratorsProjection;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends PagingAndSortingRepository<Challenge, Long> {

    ChallengeDetailProjection findDetailById(Long id);

    ChallengeAdministratorsProjection findAdministratorsById(Long id);
}
