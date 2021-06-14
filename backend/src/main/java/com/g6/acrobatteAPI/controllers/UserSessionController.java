package com.g6.acrobatteAPI.controllers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.UserSessionResult;
import com.g6.acrobatteAPI.entities.events.EventAdvance;
import com.g6.acrobatteAPI.entities.events.GenericEvent;
import com.g6.acrobatteAPI.exceptions.ApiAlreadyExistsException;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.hateoas.UserSessionModelAssembler;
import com.g6.acrobatteAPI.models.userSession.UserSessionAdvanceModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionBulkEventsModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionChoosePathModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionCreateModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionEndRunModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionEventGenericModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionGetRunsModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionPassObstacleModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionResultResponseModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionRunModel;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.ObstacleService;
import com.g6.acrobatteAPI.services.SegmentService;
import com.g6.acrobatteAPI.services.UserService;
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
import org.springframework.web.bind.annotation.PathVariable;
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
        final private ObstacleService obstacleService;
        final private UserService userService;

        private TypeMap<UserSessionResult, UserSessionResultResponseModel> userSessionResultMap;
        private TypeMap<UserSession, UserSessionModel> userSessionMap;

        @PostConstruct
        public void initialize() {
                userSessionResultMap = modelMapper.createTypeMap(UserSessionResult.class,
                                UserSessionResultResponseModel.class);

                userSessionMap = modelMapper.createTypeMap(UserSession.class, UserSessionModel.class);
        }

        @ApiOperation(value = "Récupérer toutes VOS UserSessions appartenant à ChallengeId", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping("/{id}/events")
        public ResponseEntity<UserSessionModel> sendBulkEvents(@PathVariable("id") Long id,
                        @Valid @RequestBody UserSessionBulkEventsModel userSessionBulkEventsModel)
                        throws ApiIdNotFoundException, ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());
                UserSession userSession = userSessionService.getUserSession(id);
                userSession = userSessionService.saveBulkEvents(userSession, userSessionBulkEventsModel);

                UserSessionModel userSessionModel = userSessionMap.map(userSession);

                return ResponseEntity.ok().body(userSessionModel);
        }

        @ApiOperation(value = "Récupérer toutes VOS UserSessions appartenant à ChallengeId", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping
        public ResponseEntity<List<UserSessionModel>> getAllUserSessions(@RequestParam Long challengeId)
                        throws ApiIdNotFoundException {
                Challenge challenge = challengeService.findChallenge(challengeId);

                if (challenge == null) {
                        throw new ApiIdNotFoundException("Challenge", challengeId);
                }

                List<UserSession> userSessions = userSessionService.getUserSessionsByChallenge(challenge);

                List<UserSessionModel> userSessionsModels = userSessions.stream()
                                .map(userSession -> userSessionMap.map(userSession)).collect(Collectors.toList());

                return ResponseEntity.ok().body(userSessionsModels);
        }

        @GetMapping("/user/{id}")
        public ResponseEntity<List<UserSessionModel>> getUserSessionByUser(@PathVariable Long id) {
                User user = userService.getUserById(id);

                List<UserSession> userSessions = userSessionService.getUserSessionsByUser(user);

                List<UserSessionModel> userSessionsModels = userSessions.stream()
                                .map(userSession -> userSessionMap.map(userSession)).collect(Collectors.toList());

                return ResponseEntity.ok().body(userSessionsModels);
        }

        @GetMapping("/user/self")
        public ResponseEntity<List<UserSessionModel>> getUserSessionsBySelf() throws ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                List<UserSession> userSessions = userSessionService.getUserSessionsByUser(user);

                List<UserSessionModel> userSessionsModels = userSessions.stream()
                                .map(userSession -> userSessionMap.map(userSession)).collect(Collectors.toList());

                return ResponseEntity.ok().body(userSessionsModels);
        }

        @ApiOperation(value = "Récupérer sa propre UserSession par ID du Challenge", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping("/{id}")
        public ResponseEntity<UserSessionModel> getUserSessionResult(@PathVariable("id") Long id)
                        throws ApiIdNotFoundException, ApiWrongParamsException, ApiNotAdminException,
                        ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser() != user && !user.isAdmin()) {
                        throw new ApiNotAdminException(user.getEmail(),
                                        "Vous n'êtes pas en posséssion de cette session ou admin");
                }

                UserSessionModel userSessionModel = userSessionMap.map(userSession);

                return ResponseEntity.ok().body(userSessionModel);
        }

        @ApiOperation(value = "Démarrer sa propre UserSession par ID du Challenge", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping
        public ResponseEntity<UserSessionModel> create(
                        @Valid @RequestBody UserSessionCreateModel userSessionCreateModel)
                        throws ApiIdNotFoundException, ApiAlreadyExistsException, ApiWrongParamsException,
                        ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                Challenge challenge = challengeService.findChallenge(userSessionCreateModel.getChallengeId());

                UserSession userSession = userSessionService.createUserSession(user, challenge);

                // UserSessionResult userSessionResult =
                // userSessionService.getUserSessionResult(userSession);
                // UserSessionResultResponseModel userSessionModel =
                // userSessionResultMap.map(userSessionResult);

                UserSessionModel model = userSessionMap.map(userSession);

                return ResponseEntity.ok().body(model);
        }

        @ApiOperation(value = "Avancer sur la carte en mètres", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping("{id}/advance")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addAdvanceEventToSelf(
                        @PathVariable("id") Long id,
                        @Valid @RequestBody UserSessionAdvanceModel userSessionAdvanceModel)
                        throws ApiIdNotFoundException, ApiAlreadyExistsException, ApiWrongParamsException,
                        ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser().getId() != user.getId()) {
                        throw new ApiWrongParamsException("User", "Vous n'êtes pas utilisateur de cette session");
                }

                Double advancement = userSessionAdvanceModel.getAdvancement();

                userSession = userSessionService.processAdvanceEvent(userSession, advancement);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionResultMap.map(userSessionResult);
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
        @PostMapping("{id}/choosePath")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addChoosePathEventToSelf(
                        @PathVariable("id") Long id,
                        @Valid @RequestBody UserSessionChoosePathModel userSessionChoosePathModel)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException, ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser().getId() != user.getId()) {
                        throw new ApiWrongParamsException("User", "Vous n'êtes pas utilisateur de cette session");
                }

                Segment segmentToChoose = segmentService.getById(userSessionChoosePathModel.getSegmentToChooseId())
                                .orElseThrow(() -> new ApiIdNotFoundException("Segment",
                                                userSessionChoosePathModel.getSegmentToChooseId()));

                userSession = userSessionService.processChoosePathEvent(userSession, segmentToChoose);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionResultMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @ApiOperation(value = "Passer un obstacle", response = Iterable.class, tags = "UserSession")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping("{id}/passObstacle")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addPassObstacleEventToSelf(
                        @PathVariable("id") Long id,
                        @Valid @RequestBody UserSessionPassObstacleModel userSessionPassObstacleModel)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException, ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser().getId() != user.getId()) {
                        throw new ApiWrongParamsException("User", "Vous n'êtes pas utilisateur de cette session");
                }

                Obstacle obstacleToPass = obstacleService.findById(userSessionPassObstacleModel.getObstacleToPassId())
                                .orElseThrow(() -> new ApiIdNotFoundException("Segment",
                                                userSessionPassObstacleModel.getObstacleToPassId()));

                userSession = userSessionService.processPassObstacle(userSession, obstacleToPass);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionResultMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @PostMapping("{id}/startRun")
        public ResponseEntity<EntityModel<UserSessionResultResponseModel>> addEndRunEventToSelf(@PathVariable Long id)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException, ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser().getId() != user.getId()) {
                        throw new ApiWrongParamsException("User", "Vous n'êtes pas utilisateur de cette session");
                }
                userSession = userSessionService.processStartRunEvent(userSession);

                UserSessionResult userSessionResult = userSessionService.getUserSessionResult(userSession);
                UserSessionResultResponseModel userSessionModel = userSessionResultMap.map(userSessionResult);
                EntityModel<UserSessionResultResponseModel> userSessionHateoas = modelAssembler
                                .toModel(userSessionModel);

                return ResponseEntity.ok().body(userSessionHateoas);
        }

        @GetMapping("{id}/runs")
        public ResponseEntity<List<UserSessionRunModel>> getSelfRuns(@PathVariable Long id)
                        throws ApiIdNotFoundException, ApiNoResponseException, ApiWrongParamsException,
                        ApiAlreadyExistsException, ApiNoUserException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                UserSession userSession = userSessionRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("UserSession", id));

                if (userSession.getUser().getId() != user.getId()) {
                        throw new ApiWrongParamsException("User", "Vous n'êtes pas utilisateur de cette session");
                }
                List<UserSessionRunModel> userSessionRuns = userSessionService.getRuns(userSession);

                return ResponseEntity.ok().body(userSessionRuns);
        }
}
