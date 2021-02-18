package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeDetailProjection;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;

public interface ChallengeService {

    Challenge findChallenge(Long id);

    ChallengeDetailProjection findChallengeDetail(Long id);

    List<Challenge> findAllChallenges();

    List<Challenge> findUserChallenges(User user);

    ChallengeDetailProjection create(ChallengeCreateModel challengeModel, User user);

    Optional<Challenge> create(Challenge challenge);

    Optional<Challenge> edit(Challenge challenge);

    ChallengeResponseModel convertToResponseModel(Challenge challenge);
}
