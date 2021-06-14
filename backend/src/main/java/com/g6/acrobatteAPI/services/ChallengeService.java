package com.g6.acrobatteAPI.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.CheckpointType;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.exceptions.ApiAlreadyExistsException;
import com.g6.acrobatteAPI.exceptions.ApiFileException;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
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

    public ChallengeDetailProjection findChallengeDetail(Long id) throws ApiIdNotFoundException {
        ChallengeDetailProjection challengeDetailProjection = challengeRepository.findDetailById(id);

        if (challengeDetailProjection == null)
            throw new ApiIdNotFoundException("Challenge", id);

        return challengeDetailProjection;
    }

    public Optional<Challenge> create(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

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

    public Challenge create(ChallengeCreateModel challengeModel, User user) throws ApiIdNotFoundException {

        var challenge = ChallengeFactory.create(challengeModel);

        challenge.addAdministrator(user);
        challenge.setCreator(user);

        var persistedChallenge = challengeRepository.save(challenge);

        return persistedChallenge;
    }

    public Page<Challenge> getAllChallengesPaginated(Boolean publishedOnly, Boolean adminOnly, User user,
            Pageable pageable) {
        Page<Challenge> result = null;

        if (adminOnly == true && publishedOnly == true) {
            List<User> administrators = new ArrayList<User>();
            administrators.add(user);
            result = challengeRepository.findDistinctByAdministratorsInAndPublished(administrators, true, pageable);
        } else if (adminOnly == false && publishedOnly == true) {
            result = challengeRepository.findAllByPublished(true, pageable);
        } else if (adminOnly == true && publishedOnly == false) {
            List<User> administrators = new ArrayList<User>();
            administrators.add(user);
            result = challengeRepository.findDistinctByAdministratorsIn(administrators, pageable);
        } else if (adminOnly == false && publishedOnly == false) {
            result = challengeRepository.findAll(pageable);
        }

        return result;
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

    public ChallengeResponseModel addAdministrator(Challenge challenge, User user)
            throws ApiIdNotFoundException, ApiAlreadyExistsException {

        if (challenge.getAdministrators().contains(user)) {
            throw new ApiAlreadyExistsException("User", "administrators",
                    "L'Utilisateur que vous essayez d'ajouter et déjà administrateur");
        }

        challenge.addAdministrator(user);

        // Transformerl'entité en un modèle
        ChallengeResponseModel model = modelMapper.map(challenge, ChallengeResponseModel.class);

        return model;
    }

    public ChallengeResponseModel removeAdministrator(long id, User user, long userTargetId)
            throws ApiIdNotFoundException, ApiNotAdminException, ApiNoUserException {
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

        User adminUser = adminUserOptional.orElseThrow(() -> new ApiNoUserException());

        challengeToEdit.removeAdministrator(adminUser);

        challengeRepository.save(challengeToEdit);

        // Transformerl'entité en un modèle
        ChallengeResponseModel model = modelMapper.map(challengeToEdit, ChallengeResponseModel.class);

        return model;
    }

    public Challenge publishChallenge(Challenge challenge, User publisher)
            throws ApiNotAdminException, ApiWrongParamsException {
        if (!publisher.getAdministeredChallenges().contains(challenge)) {
            throw new ApiNotAdminException(publisher.getEmail(), "Vous devez être admin pour publier le challenge");
        }

        if (!this.verifyChallenge(challenge)) {
            throw new ApiWrongParamsException("Challenge",
                    "Un début, pas d'intersections au debut, une fin, pas de culs de sacs");
        }

        challenge.setPublished(true);
        Challenge persistedChallenge = challengeRepository.save(challenge);

        return persistedChallenge;
    }

    /**
     * Validation de la composition du Challenge
     * 
     * @param challenge
     * @return
     */
    public Boolean verifyChallenge(Challenge challenge) {
        // Vérifier si le challenge a un début
        Boolean isThereAlreadyBegin = false;
        for (Checkpoint checkpoint : challenge.getCheckpoints()) {
            if (checkpoint.getCheckpointType() == CheckpointType.BEGIN) {
                // S'il y a déjà un autre checkpoint de début
                if (isThereAlreadyBegin) {
                    return false;
                }

                // Si le checkpoint de début a une mauvaise position
                if (checkpoint.getSegmentsEnds().size() > 0 || checkpoint.getSegmentsStarts().size() != 1) {
                    return false;
                }

                isThereAlreadyBegin = true;
            }
        }

        // Vérifier si le challenge a une fin
        Boolean isThereAlreadyEnd = false;
        for (Checkpoint checkpoint : challenge.getCheckpoints()) {
            if (checkpoint.getCheckpointType() == CheckpointType.END) {
                // S'il y a déjà un autre checkpoint de fin
                if (isThereAlreadyEnd) {
                    return false;
                }

                // Si le checkpoint de fin a une mauvaise position
                if (checkpoint.getSegmentsStarts().size() > 0 || checkpoint.getSegmentsEnds().size() <= 0) {
                    return false;
                }

                isThereAlreadyEnd = true;
            }
        }

        // Vérifier qu'il n'y a pas de culs de sacs
        Checkpoint start = challenge.getFirstCheckpoint()
                .orElseThrow(() -> new IllegalArgumentException("Le challenge n'as pas de début"));

        if (!this.checkNoDeadEnds(start)) {
            return false;
        }

        return true;
    }

    /**
     * Fonction Récurrente. Vérifie qu'il n'y a pas de culs de sacs dans le
     * Challenge
     * 
     * @param challenge
     * @return
     */
    public Boolean checkNoDeadEnds(Checkpoint checkpoint) {

        Boolean result = true;

        for (Segment segment : checkpoint.getSegmentsStarts()) {
            if (!checkNoDeadEnds(segment.getEnd())) {
                result = false;
            }
        }

        if (checkpoint.getSegmentsStarts().size() <= 0 && checkpoint.getCheckpointType() != CheckpointType.END) {
            result = false;
        }

        return result;
    }
}
