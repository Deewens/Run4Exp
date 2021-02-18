package com.g6.acrobatteAPI.controllers;

import java.time.Instant;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.UserSessionResult;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.hateoas.UserSessionModelAssembler;
import com.g6.acrobatteAPI.models.userSession.UserSessionAdvanceModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionCreateModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionResultResponseModel;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.ChallengeService;
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

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/userSessions")
public class UserSessionController {

    final private UserSessionRepository userSessionRepository;
    final private AuthenticationFacade authenticationFacade;
    final private UserSessionService userSessionService;
    final private ChallengeService challengeService;
    private final ModelMapper modelMapper;
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
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> getUserSessionResult() {
        return null;
    }

    @PostMapping
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> create(
            @Valid @RequestBody UserSessionCreateModel userSessionCreateModel) {
        User user = authenticationFacade.getUser().get();
        Challenge challenge = challengeService.findChallenge(userSessionCreateModel.getChallengeId());

        if (!userSessionService.findUserSessionByUserAndChallenge(user, challenge).isEmpty()) {
            throw new IllegalArgumentException("La session existe déjà");
        }

        UserSession userSession = userSessionService.createUserSession(user, challenge);

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }

    @PostMapping("self/advance")
    public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addAdvanceEventToSelf(
            @Valid @RequestBody UserSessionAdvanceModel userSessionAdvanceModel) {
        User user = authenticationFacade.getUser().get();

        UserSession userSession = userSessionRepository.findOneByUser(user);
        Double advancement = userSessionAdvanceModel.getAdvancement();

        userSession = userSessionService.addAdvanceEvent(userSession, advancement);

        UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
        UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
        EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler.toModel(userSessionModel);

        return ResponseEntity.ok().body(userSessionHateoas);
    }
}
