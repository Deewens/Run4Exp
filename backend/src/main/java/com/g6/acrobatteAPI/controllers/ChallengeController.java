package com.g6.acrobatteAPI.controllers;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import javax.websocket.server.PathParam;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.exceptions.ApiAlreadyExistsException;
import com.g6.acrobatteAPI.exceptions.ApiFileException;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNoResponseException;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.hateoas.ChallengeDetailAssembler;
import com.g6.acrobatteAPI.hateoas.ChallengeModelAssembler;
import com.g6.acrobatteAPI.models.challenge.ChallengeAddAdministratorModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeBackgroundString64ResponseModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeRemoveAdministratorModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseDetailedModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.SegmentServiceI;
import com.g6.acrobatteAPI.services.UserService;
import com.g6.acrobatteAPI.typemaps.ChallengeTypemap;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/api/challenges")
@Controller
@Api(value = "Challenge Controller", description = "API REST sur le Challenge", tags = "Challenge")
public class ChallengeController {
        // private final SegmentServiceI segmentService;
        private final ChallengeService challengeService;
        private final UserService userService;
        private final ChallengeTypemap typemap;
        private final ChallengeModelAssembler modelAssembler;
        private final ChallengeDetailAssembler challengeDetailAssembler;
        private final PagedResourcesAssembler<ChallengeResponseModel> pagedResourcesAssembler;
        private final AuthenticationFacade authenticationFacade;
        private final ModelMapper modelMapper;

        @PostConstruct
        public void initialize() {

        }

        @ApiOperation(value = "Récupérer les tous les challenges - paginés", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping(value = "/")
        public ResponseEntity<Page<Object>> pagedChallenges(@RequestParam(required = false) Boolean publishedOnly,
                        @RequestParam(required = false) Boolean adminOnly, Pageable pageable)
                        throws ApiNoUserException {
                if (publishedOnly == null)
                        publishedOnly = false;
                if (adminOnly == null)
                        adminOnly = false;

                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                Page<Challenge> challengesPage = challengeService.getAllChallengesPaginated(publishedOnly, adminOnly,
                                user, pageable);

                // Transformer la page d'entités en une page de modèles
                Page<Object> challengesResponsePage = challengesPage.map((challenge) -> {
                        return challenge != null ? typemap.getMap().map(challenge) : null;
                });

                if (!challengesResponsePage.isEmpty() && challengesResponsePage.getContent().get(0) == null)
                        challengesResponsePage = Page.empty();

                // Transformer la page de modèles en page HATEOAS
                // PagedModel<EntityModel<ChallengeResponseModel>> pagedModel =
                // pagedResourcesAssembler
                // .toModel(challengesResponsePage, modelAssembler);

                return ResponseEntity.ok().body(challengesResponsePage);
        }

        @ApiOperation(value = "Récupérer un Challenge par ID", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping("/{id}")
        public ResponseEntity<EntityModel<ChallengeResponseModel>> getChallenge(@PathVariable("id") Long id)
                        throws ApiIdNotFoundException {
                Challenge challenge = challengeService.findChallenge(id);

                // Transformerl'entité en un modèle
                ChallengeResponseModel model = typemap.getMap().map(challenge);

                // Transformer le modèle en un modèle HATEOAS
                EntityModel<ChallengeResponseModel> hateoasModel = modelAssembler.toModel(model);

                return ResponseEntity.ok().body(hateoasModel);
        }

        @ApiOperation(value = "Récupérer vue vue détaillée du Challenge par ID", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping("/{id}/detail")
        public ResponseEntity<ChallengeResponseDetailedModel> getChallengeDetail(@PathVariable("id") Long id)
                        throws ApiIdNotFoundException {
                Challenge challenge = challengeService.findChallenge(id);
                ChallengeResponseDetailedModel response = typemap.getDetailedMap().map(challenge);

                return ResponseEntity.ok().body(response);
        }

        @ApiOperation(value = "Créer un nouveau Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PostMapping
        public ResponseEntity<ChallengeResponseDetailedModel> createChallenge(
                        @RequestBody @Valid ChallengeCreateModel challengeCreateModel)
                        throws ApiIdNotFoundException, ApiNoUserException {

                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                var challenge = challengeService.create(challengeCreateModel, user);

                var challengeModel = typemap.getDetailedMap().map(challenge);

                return ResponseEntity.ok().body(challengeModel);
        }

        @ApiOperation(value = "Rajouter une image de background au Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PutMapping("/{id}/background")
        public ResponseEntity<Object> handleBackgroundUpload(@PathVariable("id") Long id,
                        @RequestParam("file") MultipartFile file)
                        throws ApiIdNotFoundException, ApiFileException, ApiNoResponseException {

                Challenge challenge = challengeService.findChallenge(id);
                if (challenge == null)
                        throw new ApiIdNotFoundException("Challenge", id);

                if (challenge.getPublished())
                        throw new ApiNoResponseException("Challenge published", "Challenge est publié");

                challengeService.updateBackground(id, file);

                return ResponseEntity.ok().body(null);
        }

        @ApiOperation(value = "Récupérer l'image de background du Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping(value = "/{id}/background", produces = MediaType.IMAGE_JPEG_VALUE)
        public @ResponseBody byte[] getBackground(@PathVariable("id") Long id)
                        throws ApiNoResponseException, ApiIdNotFoundException {

                return challengeService.getBackground(id).orElseThrow(
                                () -> new ApiNoResponseException("background", "le background est probablement null"));
        }

        @ApiOperation(value = "Récupérer l'image de background du Challenge en base64", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @GetMapping(value = "/{id}/background", params = "base64=true")
        public @ResponseBody ResponseEntity<ChallengeBackgroundString64ResponseModel> getBackgroundString64(
                        @PathVariable("id") Long id, @RequestParam(name = "base64", required = true) Boolean base64)
                        throws ApiNoResponseException, ApiIdNotFoundException {

                String str64 = challengeService.getBackgroundString64(id).orElseThrow(
                                () -> new ApiNoResponseException("background", "le background est probablement null"));
                ChallengeBackgroundString64ResponseModel model = new ChallengeBackgroundString64ResponseModel();
                model.setBackground(str64);

                return ResponseEntity.ok().body(model);
        }

        @ApiOperation(value = "Update le Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 401, message = "not authorized"), //
                        @ApiResponse(code = 403, message = "forbidden"), //
                        @ApiResponse(code = 404, message = "not found") //
        })
        @PutMapping("/{id}")
        public ResponseEntity<EntityModel<ChallengeDetailProjection>> update(@PathVariable("id") Long id,
                        @RequestBody @Valid ChallengeEditModel challengeEditModel)
                        throws ApiIdNotFoundException, ApiNoResponseException {

                Challenge challenge = challengeService.findChallenge(id);
                if (challenge == null)
                        throw new ApiIdNotFoundException("Challenge", id);

                if (challenge.getPublished())
                        throw new ApiNoResponseException("Challenge published", "Challenge est publié");

                var challengeDetail = challengeService.update(id, challengeEditModel);

                // Transformer le modèle en un modèle HATEOAS
                EntityModel<ChallengeDetailProjection> hateoasModel = challengeDetailAssembler.toModel(challengeDetail);

                return ResponseEntity.ok().body(hateoasModel);
        }

        @ApiOperation(value = "Rajouter un administrateur au Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 400, message = "idNotFound - User"), //
                        @ApiResponse(code = 403, message = "Forbidden"), //
                        @ApiResponse(code = 404, message = "Not found") //
        })
        @PutMapping("/{id}/admin")
        public ResponseEntity<ChallengeResponseModel> addAdministrator(@PathVariable("id") Long id,
                        @RequestBody @Valid ChallengeAddAdministratorModel challengeAddAdministratorModel)
                        throws ApiIdNotFoundException, ApiAlreadyExistsException, ApiNoUserException,
                        ApiNotAdminException, ApiNoResponseException {

                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());
                User admin = userService.getUserById(challengeAddAdministratorModel.getAdminId());
                var challenge = challengeService.findChallenge(id);

                if (challenge == null)
                        throw new ApiIdNotFoundException("Challenge", id);

                if (challenge.getPublished())
                        throw new ApiNoResponseException("Challenge published", "Challenge est publié");

                if (challenge.getCreator().getId() != user.getId())
                        throw new ApiNotAdminException(user.getEmail(), "Vous devez être le créateur du challenge");
                if (admin == null)
                        throw new ApiIdNotFoundException("Admin", challengeAddAdministratorModel.getAdminId());

                ChallengeResponseModel challengeResponseModel = challengeService.addAdministrator(challenge, admin);

                return ResponseEntity.ok().body(challengeResponseModel);
        }

        @ApiOperation(value = "Enlever un administrateur du Challenge", response = Iterable.class, tags = "Challenge")
        @ApiResponses(value = { //
                        @ApiResponse(code = 200, message = "Success|OK"), //
                        @ApiResponse(code = 400, message = "idNotFound - User"), //
                        @ApiResponse(code = 400, message = "alreadyExists - Admin"), //
                        @ApiResponse(code = 403, message = "Forbidden"), //
                        @ApiResponse(code = 404, message = "Not found") //
        })
        @DeleteMapping("/{id}/admin")
        public ResponseEntity<ChallengeResponseModel> removeAdministrator(@PathVariable("id") Long id,
                        @RequestBody @Valid ChallengeRemoveAdministratorModel removeAdministratorModel)
                        throws ApiIdNotFoundException, ApiNotAdminException, ApiNoUserException,
                        ApiNoResponseException {
                User user = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());
                var challenge = challengeService.findChallenge(id);

                if (challenge == null)
                        throw new ApiIdNotFoundException("Challenge", id);

                if (challenge.getPublished())
                        throw new ApiNoResponseException("Challenge published", "Challenge est publié");

                if (challenge.getCreator().getId() != user.getId())
                        throw new ApiNotAdminException(user.getEmail(), "Vous devez être le créateur du challenge");

                var model = challengeService.removeAdministrator(id, user, removeAdministratorModel.getAdminId());

                return ResponseEntity.ok().body(model);
        }

        @PutMapping("/{id}/publish")
        public ResponseEntity<ChallengeResponseModel> publishChallenge(@PathVariable("id") Long id)
                        throws ApiIdNotFoundException, ApiNotAdminException, ApiWrongParamsException,
                        ApiNoUserException, ApiNoResponseException {
                User publisher = authenticationFacade.getUser().orElseThrow(() -> new ApiNoUserException());

                Challenge challenge = challengeService.findChallenge(id);
                if (challenge == null)
                        throw new ApiIdNotFoundException("Challenge", id);

                if (challenge.getPublished())
                        throw new ApiNoResponseException("Challenge published", "Challenge est publié");

                challenge = challengeService.publishChallenge(challenge, publisher);

                ChallengeResponseModel challengeModel = typemap.getMap().map(challenge);

                return ResponseEntity.ok().body(challengeModel);
        }
}
