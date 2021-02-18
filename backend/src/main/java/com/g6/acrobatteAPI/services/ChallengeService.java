package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;

public interface ChallengeService {

    Challenge findChallenge(Long id);

    ChallengeDetailProjection findChallengeDetail(Long id);

    List<Challenge> findAllChallenges();

    Page<Challenge> pagedChallenges(Pageable pageable);

    List<Challenge> findUserChallenges(User user);

    ChallengeDetailProjection create(ChallengeCreateModel challengeModel, User user);

    Optional<Challenge> create(Challenge challenge);

    ChallengeDetailProjection update(long id, ChallengeEditModel challengeEditModel);

    ChallengeResponseModel convertToResponseModel(Challenge challenge);

    void updateBackground(long id, MultipartFile file);

    byte[] getBackground(long id);

    boolean isAdministrator(long id, String email);

    ChallengeResponseModel addAdministrator(long id, User user);

    ChallengeResponseModel removeAdministrator(long id, User user, long userTargetId);

}
