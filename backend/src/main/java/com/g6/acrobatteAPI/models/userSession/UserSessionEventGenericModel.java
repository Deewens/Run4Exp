package com.g6.acrobatteAPI.models.userSession;

import com.g6.acrobatteAPI.entities.events.EventType;

import lombok.Data;

@Data
public class UserSessionEventGenericModel {
    Long date;
    EventType type;
    String value;
}
