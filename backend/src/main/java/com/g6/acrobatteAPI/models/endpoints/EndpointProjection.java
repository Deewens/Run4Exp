package com.g6.acrobatteAPI.models.endpoints;

import org.springframework.beans.factory.annotation.Value;

public interface EndpointProjection {

    @Value("#{target.endpointId}")
    public Long getEndpointId();

    @Value("#{target.name}")
    public String getName();

    @Value("#{target.challenge.id}")
    public Long getChallengeId();
}
