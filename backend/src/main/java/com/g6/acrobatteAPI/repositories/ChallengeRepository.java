package com.g6.acrobatteAPI.repositories;

import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.projections.challenge.ChallengeAdministratorsProjection;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends PagingAndSortingRepository<Challenge, Long> {

    ChallengeDetailProjection findDetailById(Long id);

    ChallengeAdministratorsProjection findAdministratorsById(Long id);

    Page<Challenge> findAllByPublished(Boolean published, Pageable pageable);

    Page<Challenge> findDistinctByAdministratorsInAndPublished(List<User> administrators, Boolean published,
            Pageable pageable);

    Page<Challenge> findDistinctByAdministratorsIn(List<User> administrators, Pageable pageable);
}
