package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;

public interface ChallengeService {

    Challenge findChallenge(Long id);

    List<Challenge> findAllChallenges();

    Optional<Challenge> create(Challenge challenge);

    Optional<Challenge> edit(Challenge challenge);

    ChallengeResponseModel convertToResponseModel(Challenge challenge);
}
