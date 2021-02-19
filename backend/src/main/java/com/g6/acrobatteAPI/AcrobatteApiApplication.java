package com.g6.acrobatteAPI;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
@ComponentScan(basePackages = "com.g6.acrobatteAPI")
public class AcrobatteApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcrobatteApiApplication.class, args);
	}

	/**
	 * Mappeur de modèles. Utilisé pour mapper les DTOs en Entités et vice versa
	 */
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
