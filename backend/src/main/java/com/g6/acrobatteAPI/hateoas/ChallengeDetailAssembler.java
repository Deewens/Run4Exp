package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.controllers.ChallengeController;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;

import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ChallengeDetailAssembler
        implements RepresentationModelAssembler<ChallengeDetailProjection, EntityModel<ChallengeDetailProjection>> {

    @Override
    public EntityModel<ChallengeDetailProjection> toModel(ChallengeDetailProjection challenge) {
        EntityModel<ChallengeDetailProjection> model = EntityModel.of(challenge);

        try {
            model.add(linkTo(methodOn(ChallengeController.class).getChallenge(challenge.getId())).withSelfRel());
        } catch (ApiIdNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        model.add(linkTo(methodOn(ChallengeController.class).pagedChallenges(PageRequest.of(0, 10)))
                .withRel("challenges"));

        return model;
    }
}
