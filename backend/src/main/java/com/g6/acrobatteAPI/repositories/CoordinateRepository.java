package com.g6.acrobatteAPI.repositories;

import com.g6.acrobatteAPI.entities.Coordinate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {

}
