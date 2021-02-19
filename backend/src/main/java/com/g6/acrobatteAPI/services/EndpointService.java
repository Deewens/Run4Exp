package com.g6.acrobatteAPI.services;

import org.springframework.stereotype.Service;

import java.util.Optional;

import com.g6.acrobatteAPI.entities.Endpoint;
import com.g6.acrobatteAPI.repositories.EndpointRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class EndpointService {
    private final EndpointRepository endpointRepository;

    public Optional<Endpoint> getById(Long id) {
        return endpointRepository.findById(id);
    }
}
