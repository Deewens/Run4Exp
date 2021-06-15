package com.g6.acrobatteAPI.services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.entities.UserSession;
import com.g6.acrobatteAPI.entities.events.Event;
import com.g6.acrobatteAPI.entities.events.EventType;
import com.g6.acrobatteAPI.exceptions.ApiNoUserException;
import com.g6.acrobatteAPI.models.user.UserDeleteModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.models.user.UserStatisticsDistanceModel;
import com.g6.acrobatteAPI.models.user.UserStatisticsModel;
import com.g6.acrobatteAPI.models.user.UserUpdateModel;
import com.g6.acrobatteAPI.models.validators.ValidPassword;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.repositories.UserSessionRepository;
import com.google.common.collect.Iterables;

import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionRepository userSessionRepository;
    private final UserSessionService userSessionService;

    public void signup(User user) {
        userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    public User getUserByEmail(String email) throws ApiNoUserException {
        return userRepository.findByEmail(email).orElseThrow(() -> new ApiNoUserException());
    }

    public void createUser(User user) {
        try {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            user.setRoles(new ArrayList<Role>(Arrays.asList(Role.ROLE_CLIENT, Role.ROLE_ADMIN)));
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Le email existe déjà");
        }
    }

    public User updateUser(String email, UserUpdateModel userUpdateModel) throws ApiNoUserException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ApiNoUserException());

        if (userUpdateModel.firstName != null)
            user.setFirstName(userUpdateModel.firstName);

        if (userUpdateModel.name != null)
            user.setName(userUpdateModel.name);

        if (userUpdateModel.newPassword != null && userUpdateModel.newPasswordConfirmation != null) {

            if (!passwordEncoder.matches(userUpdateModel.getPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Mot de passe incorrect");
            }

            if (!userUpdateModel.newPassword.equals(userUpdateModel.newPasswordConfirmation)) {
                throw new IllegalArgumentException(
                        "Le mot de passe de confirmation doit correspondre au nouveau mot de passe");
            }

            @ValidPassword
            String validPassword = userUpdateModel.newPassword;
            String encodedPassword = passwordEncoder.encode(validPassword);

            user.setPassword(encodedPassword);
        }

        userRepository.save(user);

        return user;
    }

    public UserResponseModel convertToResponseModel(User user) {
        UserResponseModel userDTO = modelMapper.map(user, UserResponseModel.class);
        userDTO.setSuperAdmin(false);

        if (user.getRoles().contains(Role.ROLE_ADMIN)) {
            userDTO.setSuperAdmin(true);
        }

        return userDTO;
    }

    public void deleteUser(String email, UserDeleteModel userDeleteModel) throws ApiNoUserException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ApiNoUserException());

        try {
            String encodedPassword = user.getPassword();

            if (!passwordEncoder.matches(userDeleteModel.password, encodedPassword)) {
                throw new IllegalArgumentException("Mot de passe incorrect");
            }

            userRepository.delete(user);

        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }
    }

    public UserStatisticsModel calculateUserStatistics(User user) {
        var statisticsModel = new UserStatisticsModel();

        Double totalDistance = 0.0;
        Long totalTime = 0L;
        var dailyDistances = new ArrayList<UserStatisticsDistanceModel>();
        int ongoingChallenges = 0;
        int finishedChallenges = 0;

        List<UserSession> userSessions = userSessionRepository.findAllByUser(user);

        for (var userSession : userSessions) {
            for (var event : userSession.getEvents()) {
                if (event.getEventType() == EventType.ADVANCE) {
                    // Gérer les distances journalières

                    // Récupérer la date sans le temps
                    var date = LocalDate.ofInstant(event.getDate().toInstant(), ZoneId.systemDefault());
                    var advancement = event.getValue() != null ? Double.parseDouble(event.getValue()) : 0.0;

                    // Regarder si la date précise existe déjà
                    Boolean isAlreadyDate = false;
                    for (var dailyDistance : dailyDistances) {
                        if (dailyDistance.getDay().equals(date)) {
                            isAlreadyDate = true;
                            dailyDistance.addDistance(advancement);
                        }
                    }

                    if (!isAlreadyDate) {
                        var newDailyDistance = new UserStatisticsDistanceModel();
                        newDailyDistance.setDay(date);
                        newDailyDistance.setDistance(advancement);

                        dailyDistances.add(newDailyDistance);
                    }

                    // Gérer l'avancement total
                    totalDistance += advancement;
                }

                // Gérer le temps total
                Event firstEvent = Iterables.getFirst(userSession.getEvents(), null);
                Event lastEvent = Iterables.getLast(userSession.getEvents(), null);
                Long delta = (lastEvent.getDate().getTime() - firstEvent.getDate().getTime()) / 1000;
                totalTime += delta;
            }

            List<UserSession> ongoingUserSessions = userSessionService.getUserSessionsByUser(user, true, false);
            ongoingChallenges = ongoingUserSessions.size();

            List<UserSession> finishedUserSessions = userSessionService.getUserSessionsByUser(user, false, true);
            finishedChallenges = finishedUserSessions.size();
        }

        statisticsModel.setDailyDistance(dailyDistances);
        statisticsModel.setTotalTime(totalTime);
        statisticsModel.setOngoingChallenges(ongoingChallenges);
        statisticsModel.setFinishedChallenges(finishedChallenges);
        statisticsModel.setTotalDistance(totalDistance);

        return statisticsModel;
    }
}
