package com.g6.acrobatteAPI.projections.user;

import org.springframework.beans.factory.annotation.Value;

public interface UserProjection {

    @Value("#{target.id}")
    public Long getId();

    @Value("#{target.email}")
    public String getEmail();

}
