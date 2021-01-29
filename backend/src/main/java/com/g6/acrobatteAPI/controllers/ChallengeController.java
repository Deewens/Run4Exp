package com.g6.acrobatteAPI.controllers;

import java.util.List;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.services.ChallengeService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping(value = "/challenges")
public class ChallengeController {
    private final ChallengeService challengeService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<ChallengeResponseModel>> getAllChallenges() {
        List<Challenge> challenges = challengeService.findAllChallenges();

        List<ChallengeResponseModel> responses = modelMapper.map(challenges, new TypeToken<List<Challenge>>() {
        }.getType());

        System.out.println(responses.toString());

        return ResponseEntity.ok().body(responses);
    }

    @PostMapping
    public ResponseEntity<ChallengeResponseModel> createChallenge(
            @RequestBody @Valid ChallengeCreateModel challengeCreateModel) {
        Challenge challenge = ChallengeFactory.create(challengeCreateModel);

        Challenge persistedChallenge = challengeService.create(challenge).get();

        ChallengeResponseModel responseModel = challengeService.convertToResponseModel(persistedChallenge);

        return ResponseEntity.ok().body(responseModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeResponseModel> editChallenge(@PathVariable("id") Long id,
            @RequestBody @Valid ChallengeEditModel challengeEditModel) {
        Challenge challengeToEdit = challengeService.findChallenge(id);
        if (challengeToEdit == null) {
            throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");
        }

        String name = challengeEditModel.getName();

        if (name != null && !name.equals("")) {
            challengeToEdit.setName(name);
        }

        String description = challengeEditModel.getDescription();
        if (description != null) {
            challengeToEdit.setDescription(description);
        }

        challengeService.edit(challengeToEdit);

        ChallengeResponseModel responseModel = challengeService.convertToResponseModel(challengeToEdit);

        return ResponseEntity.ok().body(responseModel);
    }
}
