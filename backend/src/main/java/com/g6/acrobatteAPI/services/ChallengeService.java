package com.g6.acrobatteAPI.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.exceptions.ApiAlreadyExistsException;
import com.g6.acrobatteAPI.exceptions.ApiFileException;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.projections.challenge.ChallengeAdministratorsProjection;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;
import com.g6.acrobatteAPI.projections.user.UserProjection;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;

import org.apache.commons.io.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final ModelMapper modelMapper;

    public Challenge findChallenge(Long id) throws ApiIdNotFoundException {
        return challengeRepository.findById(id).orElseThrow(() -> new ApiIdNotFoundException("challenge", id));
    }

    public List<Challenge> findAllChallenges() {
        List<Challenge> challenges = new ArrayList<>();
        challengeRepository.findAll().forEach(challenges::add);

        return challenges;
    }

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

    public ChallengeDetailProjection findChallengeDetail(Long id) throws ApiIdNotFoundException {
        ChallengeDetailProjection challengeDetailProjection = challengeRepository.findDetailById(id);

        if (challengeDetailProjection == null)
            throw new ApiIdNotFoundException("Challenge", id);

        return challengeDetailProjection;
    }

    public Optional<Challenge> create(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

        if (challengeResp == null)
            return Optional.empty();

        return Optional.of(challengeResp);
    }

    public ChallengeDetailProjection update(long id, ChallengeEditModel challengeEditModel)
            throws ApiIdNotFoundException {

        Challenge challengeEntity = challengeRepository.findById(id)
                .orElseThrow(() -> new ApiIdNotFoundException("challenge", id));

        challengeEntity.setName(challengeEditModel.getName());

        challengeEntity.setDescription(challengeEditModel.getDescription());

        challengeEntity.setShortDescription(challengeEditModel.getShortDescription());

        challengeEntity.setScale(challengeEditModel.getScale());

        challengeRepository.save(challengeEntity);

        return findChallengeDetail(id);
    }

    public ChallengeResponseModel convertToResponseModel(Challenge challenge) {
        return modelMapper.map(challenge, ChallengeResponseModel.class);
    }

    public ChallengeDetailProjection create(ChallengeCreateModel challengeModel, User user)
            throws ApiIdNotFoundException {

        Challenge challengeEntity = ChallengeFactory.create(challengeModel);

        challengeEntity.addAdministrator(user);

        challengeRepository.save(challengeEntity);

        return findChallengeDetail(challengeEntity.getId());
    }

    public Page<Challenge> pagedChallenges(Pageable pageable) {

        Page<Challenge> challengesPage = challengeRepository.findAll(pageable);

        return challengesPage;
    }

    public void updateBackground(long id, MultipartFile file) throws ApiIdNotFoundException, ApiFileException {

        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ApiIdNotFoundException("challenge", id));

        if (file.getSize() > 4000000) {
            throw new ApiFileException(file.getName(), file.getSize(), "Le fichier est trop lourd");
        }
        try {

            challenge.setBackground(file.getBytes());

            challengeRepository.save(challenge);
        } catch (IOException e) {
            e.printStackTrace();
            throw new ApiFileException(file.getName(), file.getSize(), "Erreur lors du write");
        }
    }

    public Optional<byte[]> getBackground(long id) throws ApiIdNotFoundException {

        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ApiIdNotFoundException("Challenge", id, ""));

        if (challenge.getBackground() == null)
            return Optional.empty();

        return Optional.of(challenge.getBackground());
    }

    public Optional<String> getBackgroundString64(long id) throws ApiIdNotFoundException {
        Optional<byte[]> optional = getBackground(id);
        if (optional.isEmpty())
            return Optional.empty();

        byte[] backgroundBytes = optional.get();

        String encodedString = Base64.getEncoder().encodeToString(backgroundBytes);

        return Optional.of(encodedString);
    }

    public boolean isAdministrator(long id, String email) throws ApiIdNotFoundException {

        ChallengeAdministratorsProjection challengeToEdit = challengeRepository.findAdministratorsById(id);

        if (challengeToEdit == null) {
            throw new ApiIdNotFoundException("Challenge", id, "");
        }

        Optional<UserProjection> adminUserOptional = challengeToEdit.getAdministrators().stream()
                .filter(admin -> admin.getEmail() == email).findAny();

        return !adminUserOptional.isEmpty();
    }

    public ChallengeResponseModel addAdministrator(long id, User user)
            throws ApiIdNotFoundException, ApiAlreadyExistsException {

        if (isAdministrator(id, user.getEmail())) {
            throw new ApiAlreadyExistsException("User", "administrators",
                    "L'Utilisateur que vous essayez d'ajouter et déjà administrateur");
        }

        Challenge challenge = findChallenge(id);

        challenge.addAdministrator(user);

        // Transformerl'entité en un modèle
        ChallengeResponseModel model = modelMapper.map(challenge, ChallengeResponseModel.class);

        return model;
    }

    public ChallengeResponseModel removeAdministrator(long id, User user, long userTargetId)
            throws ApiIdNotFoundException, ApiNotAdminException {
        Challenge challengeToEdit = challengeRepository.findById(id)
                .orElseThrow(() -> new ApiIdNotFoundException("challenge", id));

        if (!challengeToEdit.getAdministrators().contains(user)) {
            throw new ApiNotAdminException("Vous", "Vous n'êtes pas administrateur du challenge");
        }

        Optional<User> adminUserOptional = challengeToEdit.getAdministrators().stream()
                .filter(admin -> admin.getId() == userTargetId).findAny();

        if (!adminUserOptional.isEmpty()) {
            throw new ApiNotAdminException(user.getEmail(),
                    "L'utilisateur demandé n'est pas administrateur du challenge");
        }

        User adminUser = adminUserOptional.get();

        challengeToEdit.removeAdministrator(adminUser);

        challengeRepository.save(challengeToEdit);

        // Transformerl'entité en un modèle
        ChallengeResponseModel model = modelMapper.map(challengeToEdit, ChallengeResponseModel.class);

        return model;
    }
}
