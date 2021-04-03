package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;

public class ChallengeFactory {
    public static Challenge create(ChallengeCreateModel challengeCreateModel) {
        return new Challenge(challengeCreateModel.getName(), challengeCreateModel.getDescription(),
                challengeCreateModel.getShortDescription(), challengeCreateModel.getScale());
    }

    public static Challenge create(ChallengeEditModel challengeEditModel) {
        return new Challenge(challengeEditModel.getName(), challengeEditModel.getDescription(),
                challengeEditModel.getShortDescription(), challengeEditModel.getScale());
    }
}
