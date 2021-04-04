package com.g6.acrobatteAPI.projections.challenge;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;

public interface ChallengeDetailProjection {

    @Value("#{target.id}")
    public Long getId();

    @Value("#{target.name}")
    public String getName();

    @Value("#{target.description}")
    public String getDescription();

    @Value("#{target.shortDescription}")
    public String getShortDescription();

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

}
