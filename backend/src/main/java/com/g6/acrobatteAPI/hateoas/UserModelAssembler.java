package com.g6.acrobatteAPI.hateoas;

import com.g6.acrobatteAPI.controllers.UserController;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.models.user.UserResponseModel;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class UserModelAssembler
                implements RepresentationModelAssembler<UserResponseModel, EntityModel<UserResponseModel>> {

        @Override
        public EntityModel<UserResponseModel> toModel(UserResponseModel user) {

                EntityModel<UserResponseModel> model = EntityModel.of(user);

                model.add(linkTo(methodOn(UserController.class).getUser(user.getId())).withSelfRel());

                return model;
        }

        public EntityModel<UserResponseModel> toModel(UserResponseModel user, boolean self) throws ApiNoUserException {
                EntityModel<UserResponseModel> model = EntityModel.of(user);

                if (self) {
                        model.add(linkTo(methodOn(UserController.class).getSelf()).withSelfRel());
                }

                model.add(linkTo(methodOn(UserController.class).getUser(user.getId())).withSelfRel());

                return model;
        }
}
