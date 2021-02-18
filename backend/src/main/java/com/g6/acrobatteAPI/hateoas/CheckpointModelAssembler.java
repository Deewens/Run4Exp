package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.controllers.CheckpointController;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class CheckpointModelAssembler
        implements RepresentationModelAssembler<CheckpointResponseModel, EntityModel<CheckpointResponseModel>> {

    @Override
    public EntityModel<CheckpointResponseModel> toModel(CheckpointResponseModel checkpoint) {
        EntityModel<CheckpointResponseModel> model = EntityModel.of(checkpoint);
        // model.add(linkTo(methodOn(CheckpointController.class).getChallenge(checkpoint.getId())).withSelfRel());
        // model.add(linkTo(methodOn(CheckpointController.class).getAllChallenges())
        // .withRel("challenges"));

        return model;
    }
}
