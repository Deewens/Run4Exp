package com.g6.acrobatteAPI;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;

import org.modelmapper.ModelMapper;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
@ComponentScan(basePackages = "com.g6.acrobatteAPI")
public class AcrobatteApiApplication implements ApplicationRunner {

	private final ChallengeRepository challengeRepository;

	public static void main(String[] args) {
		SpringApplication.run(AcrobatteApiApplication.class, args);
	}

	/**
	 * Préremplir la BD avec les données de test
	 */
	@Override
	public void run(ApplicationArguments arg0) throws Exception {
		Challenge challengeA = new Challenge();
		challengeA.setName("A challenge");
		challengeA.setDescription("A description");
		challengeRepository.save(challengeA);

		Challenge challengeB = new Challenge();
		challengeB.setName("B challenge");
		challengeB.setDescription("B description");
		challengeRepository.save(challengeB);

		Challenge challengeC = new Challenge();
		challengeC.setName("C challenge");
		challengeC.setDescription("C description");
		challengeRepository.save(challengeC);

		Challenge challengeD = new Challenge();
		challengeD.setName("D challenge");
		challengeD.setDescription("D description");
		challengeRepository.save(challengeD);
	}

	/**
	 * Mappeur de modèles. Utilisé pour mapper les DTOs en Entités et vice versa
	 */
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
