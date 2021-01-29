package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ModelMapper modelMapper;

    @Override
    public Challenge findChallenge(Long id) {
        return challengeRepository.getOne(id);
    }

    @Override
    public List<Challenge> findAllChallenges() {
        return challengeRepository.findAll();
    }

    @Override
    public Optional<Challenge> create(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

        if (challengeResp == null)
            return Optional.empty();

        return Optional.of(challengeResp);
    }

    @Override
    public Optional<Challenge> edit(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

        if (challengeResp == null)
            return Optional.empty();

        return Optional.of(challengeResp);
    }

    @Override
    public ChallengeResponseModel convertToResponseModel(Challenge challenge) {
        return modelMapper.map(challenge, ChallengeResponseModel.class);
    }
}
