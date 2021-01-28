package com.g6.acrobatteAPI.services;

import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;

public interface ChallengeService {

    Challenge findChallenge(Long id);

    List<Challenge> findAllChallenge();

}
