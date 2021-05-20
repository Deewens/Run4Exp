package com.g6.acrobatteAPI.controllers;

import java.time.Instant;
import java.util.Date;
import java.util.List;

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
import com.g6.acrobatteAPI.models.userSession.UserSessionEndRunModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionGetRunsModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionResultResponseModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionRunModel;
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

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiOperation;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/userSessions")
@Api(value = "UserSession Controller", description = "API REST sur les Sessions Utilisateurs de course", tags = "UserSession")
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
                userSessionMap = modelMapper.createTypeMap(UserSessionResult.class,
                                UserSessionResultResponseModel.class);
        }

        @ApiOperation(value = "Récupérer toutes les UserSessions", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping
        public ResponseEntity<CollectionModel<EntityModel<UserSessionResultResponseModel>>> getAllUserSessionResults() {
                return null;
        }

        @ApiOperation(value = "Récupérer sa propre UserSession par ID du Challenge", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
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
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @ApiOperation(value = "Démarrer sa propre UserSession par ID du Challenge", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> create(
                        @Valid @RequestBody UserSessionCreateModel userSessionCreateModel)
                        throws ApiIdNotFoundException, ApiAlreadyExistsException, ApiWrongParamsException {
                User user = authenticationFacade.getUser().get();
                Challenge challenge = challengeService.findChallenge(userSessionCreateModel.getChallengeId());

                if (!userSessionService.findUserSessionByUserAndChallenge(user, challenge).isEmpty()) {
                        throw new ApiAlreadyExistsException("UserSession", "Challenge-User",
                                        "Cette session existe déjà");
                }

                UserSession userSession = userSessionService.createUserSession(user, challenge);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @ApiOperation(value = "Avancer sur la carte en mètres", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping("self/advance")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addAdvanceEventToSelf(
                        @Valid @RequestBody UserSessionAdvanceModel userSessionAdvanceModel)
                        throws ApiIdNotFoundException, ApiAlreadyExistsException {
                User user = authenticationFacade.getUser().get();

                Challenge challenge = challengeService.findChallenge(userSessionAdvanceModel.getChallengeId());

                UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge)
                                .orElseThrow(() -> new ApiAlreadyExistsException("UserSession", "Challenge-User",
                                                "La session n'existe pas"));
                Double advancement = userSessionAdvanceModel.getAdvancement();

                userSession = userSessionService.processAdvanceEvent(userSession, advancement);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @ApiOperation(value = "Choisir un Segment si on est sur un croisement", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping("self/choosePath")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addChoosePathEventToSelf(
                        @Valid @RequestBody UserSessionChoosePathModel userSessionChoosePathModel)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException {
                User user = authenticationFacade.getUser().get();

                Challenge challenge = challengeService.findChallenge(userSessionChoosePathModel.getChallengeId());
                UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge)
                                .orElseThrow(() -> new ApiAlreadyExistsException("UserSession", "Challenge-User",
                                                "Cette session existe déjà"));

                Segment segmentToChoose = segmentService.getById(userSessionChoosePathModel.getSegmentToChooseId())
                                .orElseThrow(() -> new ApiIdNotFoundException("Segment",
                                                userSessionChoosePathModel.getSegmentToChooseId()));

                userSession = userSessionService.processChoosePathEvent(userSession, segmentToChoose);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @PostMapping("self/endRun")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addEndRunEventToSelf(
                        @Valid @RequestBody UserSessionEndRunModel userSessionEndRunModel)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException {
                User user = authenticationFacade.getUser().get();

                Challenge challenge = challengeService.findChallenge(userSessionEndRunModel.getChallengeId());
                UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge).orElseThrow(
                                () -> new ApiIdNotFoundException("UserSession", null, "La session n'existe pas"));

                userSession = userSessionService.processStartRunEvent(userSession);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @GetMapping("self/runs")
        public ResponseEntity<List<UserSessionRunModel>> getSelfRuns(
                        @Valid @RequestBody UserSessionGetRunsModel userSessionGetRunsModel)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException {
                User user = authenticationFacade.getUser().get();

                Challenge challenge = challengeService.findChallenge(userSessionGetRunsModel.getChallengeId());
                UserSession userSession = userSessionRepository.findOneByUserAndChallenge(user, challenge).orElseThrow(
                                () -> new ApiIdNotFoundException("UserSession", null, "La session n'existe pas"));

                userSession = userSessionService.processStartRunEvent(userSession);

                List<UserSessionRunModel> userSessionRuns = userSessionService.getRuns(userSession);

                return ResponseEntity.ok().body(userSessionRuns);
        }
}
