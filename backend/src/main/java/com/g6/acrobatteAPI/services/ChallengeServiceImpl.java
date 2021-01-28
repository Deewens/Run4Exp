package com.g6.acrobatteAPI.services;

import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;

public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;

    public ChallengeServiceImpl(ChallengeRepository challengeRepository) {
        super();
        this.challengeRepository = challengeRepository;
    }

    @Override
    public Challenge findChallenge(Long id) {
        return challengeRepository.getOne(id);
    }

    @Override
    public List<Challenge> findAllChallenge() {
        return challengeRepository.findAll();
    }

}
