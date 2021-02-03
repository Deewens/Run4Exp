package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.controllers.ChallengeController;
import com.g6.acrobatteAPI.controllers.UserController;
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
        model.add(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
        model.add(linkTo(methodOn(ChallengeController.class).getAllChallenges(PageRequest.of(0, 10)))
                .withRel("challenges"));

        challenge.getAdministratorsId().stream().forEach(
                (adminId) -> model.add(linkTo(methodOn(UserController.class).getUser(adminId)).withRel("admins")));

        return model;
    }
}
