package com.g6.acrobatteAPI.models.userSession;

import java.util.List;

import lombok.Data;

@Data
public class UserSessionModel {
    Long challengeId;
    Long userId;
    Long id;
    List<UserSessionEventGenericModel> events;
}
