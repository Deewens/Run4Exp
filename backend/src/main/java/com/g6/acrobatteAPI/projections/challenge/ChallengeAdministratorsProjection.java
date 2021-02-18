package com.g6.acrobatteAPI.projections.challenge;

import java.util.List;

import com.g6.acrobatteAPI.projections.user.UserProjection;

import org.springframework.beans.factory.annotation.Value;

public interface ChallengeAdministratorsProjection {

    @Value("#{target.id}")
    public Long getId();

    @Value("#{target.administrators}")
    public List<UserProjection> getAdministrators();

}
