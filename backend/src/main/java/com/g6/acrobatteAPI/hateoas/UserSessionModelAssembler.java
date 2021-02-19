package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.models.userSession.UserSessionResultResponseModel;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class UserSessionModelAssembler implements
        RepresentationModelAssembler<UserSessionResultResponseModel, EntityModel<UserSessionResultResponseModel>> {

    @Override
    public EntityModel<UserSessionResultResponseModel> toModel(UserSessionResultResponseModel userSession) {
        EntityModel<UserSessionResultResponseModel> model = EntityModel.of(userSession);
        // model.add(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
        // model.add(linkTo(methodOn(ChallengeController.class).getAllChallenges(PageRequest.of(0,
        // 10)))
        // .withRel("challenges"));
        return model;
    }

}
