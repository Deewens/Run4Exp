package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.Checkpoint;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {

}
