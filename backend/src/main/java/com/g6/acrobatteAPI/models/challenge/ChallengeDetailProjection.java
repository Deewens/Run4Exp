package com.g6.acrobatteAPI.models.challenge;

import java.util.List;

import com.g6.acrobatteAPI.models.endpoints.EndpointProjection;

import org.springframework.beans.factory.annotation.Value;

public interface ChallengeDetailProjection {

    @Value("#{target.id}")
    public Long getId();

    @Value("#{target.name}")
    public String getName();

    @Value("#{target.description}")
    public String getDescription();

    @Value("#{target.scale}")
    public double getScale();

    // @Value("#{target.administrators.id}")
    // public List<Long> getAdministratorsId();

    // @Value("#{target.obstacles}")
    // public List<EndpointProjection> getObstacles();

    // @Value("#{target.checkpoints}")
    // public List<EndpointProjection> getCheckpoints();

    // @Value("#{target.segments}")
    // public List<EndpointProjection> getSegments();

    @Value("#{target.endpoints}")
    public List<EndpointProjection> getEndpoints();

}
