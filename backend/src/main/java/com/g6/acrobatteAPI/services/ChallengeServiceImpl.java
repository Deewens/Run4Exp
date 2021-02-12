package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.challenge.ChallengeDetailProjection;
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
        return challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Le challenge avec cet id n'existe pas"));
    }

    @Override
    public List<Challenge> findAllChallenges() {
        List<Challenge> challenges = new ArrayList<>();
        challengeRepository.findAll().forEach(challenges::add);

        return challenges;
    }

    @Override
    public List<Challenge> findUserChallenges(User user) {
        List<Challenge> challenges = new ArrayList<>();

        Consumer<Challenge> lambda = (challenge) -> {
            if (challenge.getName() == "Hello") {
                challenges.add(challenge);
            }
        };

        challengeRepository.findAll().forEach(lambda);

        return null;
    }

    public ChallengeDetailProjection findChallengeDetail(Long id) {
        return challengeRepository.findDetailById(id);
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
