package com.g6.acrobatteAPI;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.services.UserService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class BootstrapData implements CommandLineRunner {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    private final UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // User user = new User();
        // user.setFirstName("Ilya");
        // user.setName("Ukhanov");
        // user.setEmail("ilya@gmail.com");
        // user.setPassword("1234");

        // userService.createUser(user);

        Challenge challengeA = new Challenge();
        challengeA.setName("A challenge");
        challengeA.setDescription("A description");
        // challengeA.getAdministrators().add(user);
        // user.getChallenges().add(challengeA);
        challengeRepository.save(challengeA);
        // userRepository.save(user);

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

}
