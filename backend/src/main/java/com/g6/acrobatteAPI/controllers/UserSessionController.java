package com.g6.acrobatteAPI.controllers;

import java.time.Instant;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.UserSessionResult;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.exceptions.ApiAlreadyExistsException;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.hateoas.UserSessionModelAssembler;
import com.g6.acrobatteAPI.models.userSession.UserSessionAdvanceModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionChoosePathModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionCreateModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionResultResponseModel;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.SegmentService;
import com.g6.acrobatteAPI.services.UserSessionService;

import org.apache.catalina.connector.Response;
import org.hibernate.EntityMode;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/userSessions")
public class UserSessionController {

    final private UserSessionRepository userSessionRepository;
    final private AuthenticationFacade authenticationFacade;
    final private UserSessionService userSessionService;
    final private ChallengeService challengeService;
    private final ModelMapper modelMapper;
    private final SegmentService segmentService;
    final private UserSessionModelAssembler modelAssembler;

    private TypeMap<UserSessionResult, UserSessionResultResponseModel> userSessionMap;

    @PostConstruct
    public void initialize() {
        userSessionMap = modelMapper.createTypeMap(UserSessionResult.class, UserSessionResultResponseModel.class);
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<UserSessionResultResponseModel>>> getAllUserSessionResults() {
        return null;
    }

    @GetMapping("self")
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> getUserSessionResult(
            @RequestParam(name = "challengeId", required = true) Long challengeId)
            throws ApiIdNotFoundException, ApiWrongParamsException {
        User user = authenticationFacade.getUser().get();

        Challenge challenge = challengeService.findChallenge(challengeId);
        UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge)
                .orElseThrow(() -> new ApiWrongParamsException("userSession", "créez une session",
                        "Cette session n'exite pas - créez une session entre vous et le challenge"));

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }

    @PostMapping
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> create(
            @Valid @RequestBody UserSessionCreateModel userSessionCreateModel)
            throws ApiIdNotFoundException, ApiAlreadyExistsException, ApiWrongParamsException {
        User user = authenticationFacade.getUser().get();
        Challenge challenge = challengeService.findChallenge(userSessionCreateModel.getChallengeId());

        if (!userSessionService.findUserSessionByUserAndChallenge(user, challenge).isEmpty()) {
            throw new ApiAlreadyExistsException("UserSession", "Challenge-User", "Cette session existe déjà");
        }

        UserSession userSession = userSessionService.createUserSession(user, challenge);

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }

    @PostMapping("self/advance")
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addAdvanceEventToSelf(
            @Valid @RequestBody UserSessionAdvanceModel userSessionAdvanceModel)
            throws ApiIdNotFoundException, ApiAlreadyExistsException {
        User user = authenticationFacade.getUser().get();

        Challenge challenge = challengeService.findChallenge(userSessionAdvanceModel.getChallengeId());

        UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge).orElseThrow(
                () -> new ApiAlreadyExistsException("UserSession", "Challenge-User", "La session n'existe pas"));
        Double advancement = userSessionAdvanceModel.getAdvancement();

        userSession = userSessionService.addAdvanceEvent(userSession, advancement);

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }

    @PostMapping("self/choosePath")
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addChoosePathEventToSelf(
            @Valid @RequestBody UserSessionChoosePathModel userSessionChoosePathModel)
            throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException, ApiAlreadyExistsException {
        User user = authenticationFacade.getUser().get();

        Challenge challenge = challengeService.findChallenge(userSessionChoosePathModel.getChallengeId());
        UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge).orElseThrow(
                () -> new ApiAlreadyExistsException("UserSession", "Challenge-User", "Cette session existe déjà"));

        Segment segmentToChoose = segmentService.getById(userSessionChoosePathModel.getSegmentToChooseId()).orElseThrow(
                () -> new ApiIdNotFoundException("Segment", userSessionChoosePathModel.getSegmentToChooseId()));

        userSession = userSessionService.addChoosePathEvent(userSession, segmentToChoose);

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }
}
