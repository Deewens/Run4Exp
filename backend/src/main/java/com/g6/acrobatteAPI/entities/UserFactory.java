package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.user.UserSignupModel;

public class UserFactory {

    public static User create(UserSignupModel userSignupModel) {
        return new User(userSignupModel.name, userSignupModel.firstName, userSignupModel.email,
                userSignupModel.password);
    }

}
