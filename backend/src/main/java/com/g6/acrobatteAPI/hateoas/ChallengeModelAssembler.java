package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.controllers.ChallengeController;
import com.g6.acrobatteAPI.controllers.UserController;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;

import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ChallengeModelAssembler
                implements RepresentationModelAssembler<ChallengeResponseModel, EntityModel<ChallengeResponseModel>> {

        @Override
        public EntityModel<ChallengeResponseModel> toModel(ChallengeResponseModel challenge) {
                EntityModel<ChallengeResponseModel> model = EntityModel.of(challenge);
                try {
                        model.add(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId()))
                                        .withSelfRel());
                } catch (ApiIdNotFoundException e) {
                        System.out.println(e.getMessage());
                }
                model.add(linkTo(methodOn(ChallengeController.class).pagedChallenges(PageRequest.of(0, 10)))
                                .withRel("challenges"));

                // HalModelBuilder model = HalModelBuilder.halModelOf(challenge);
                // model.link(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
                // model.link(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
                // model.link(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
                // model.embed()

                // CollectionModel<ChallengeResponseModel> collectionModel =
                // CollectionModel.of();

                challenge.getAdministratorsId().stream().forEach((adminId) -> {
                        try {
                                model.add(linkTo(methodOn(UserController.class).getUser(adminId)).withRel("admins"));
                        } catch (ApiIdNotFoundException e) {
                                System.out.println(e.getMessage());
                        }
                });

                return model;
        }
}
