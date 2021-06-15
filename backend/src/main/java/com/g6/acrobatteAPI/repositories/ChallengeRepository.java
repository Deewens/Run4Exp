package com.g6.acrobatteAPI.repositories;

import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.projections.challenge.ChallengeAdministratorsProjection;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends PagingAndSortingRepository<Challenge, Long> {

    ChallengeDetailProjection findDetailById(Long id);

    ChallengeAdministratorsProjection findAdministratorsById(Long id);

    Page<Challenge> findAllByPublished(Boolean published, Pageable pageable);

    Page<Challenge> findDistinctByAdministratorsInAndPublished(List<User> administrators, Boolean published,
            Pageable pageable);

    // @Query("select c from Challenge c left join User u where c.administrators =
    // :admin")
    @Query("select ac from User u left join u.administeredChallenges ac where u = :admin")
    Page<Challenge> findDistinctByAdministratorsIn(@Param("admin") User admin, Pageable pageable);
}
