package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.Endpoint;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EndpointRepository extends JpaRepository<Endpoint, Long> {
    
}
