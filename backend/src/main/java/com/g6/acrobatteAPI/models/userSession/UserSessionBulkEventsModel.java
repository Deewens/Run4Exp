package com.g6.acrobatteAPI.models.userSession;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class UserSessionBulkEventsModel {
    List<UserSessionEventGenericModel> events;
    Long userSessionId;
}
