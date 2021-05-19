package com.g6.acrobatteAPI.rest;

import static io.restassured.RestAssured.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import java.io.File;

import com.g6.acrobatteAPI.util.TokenProvider;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.MultiPartSpecBuilder;

import io.restassured.filter.log.LogDetail;

import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionAdvanceModel;
import com.g6.acrobatteAPI.models.userSession.UserSessionCreateModel;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import static org.hamcrest.CoreMatchers.hasItems;
import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;
import static io.restassured.http.ContentType.*;
import static io.restassured.module.jsv.JsonSchemaValidator.*;
import io.restassured.http.ContentType;
import static org.hamcrest.Matchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserSessionControllerTest {
    @LocalServerPort
    private int port;

    @Autowired
    TokenProvider tokenProvider;

    private Long challengeId = 4L;

    private RequestSpecBuilder requestSpec = new RequestSpecBuilder();

    @Before
    public void setup() {
        requestSpec.setPort(port).addHeader("Authorization", tokenProvider.getToken(true))
                .addHeader("Accept", "application/json").setContentType(ContentType.JSON);
    }

    @Test
    public void testCreate() {
        UserSessionCreateModel userSessionCreateModel = new UserSessionCreateModel();
        userSessionCreateModel.setChallengeId(challengeId);

        given().//
                spec(requestSpec.build()).//
                body(userSessionCreateModel).//
                when().//
                post("/api/userSessions").//
                then().//
                log().//
                ifValidationFails().statusCode(200).//
                body(matchesJsonSchemaInClasspath("schemas/UserSessionResultSchema.json")).//
                body("advancement", equalTo(0.0));
    }

    @Test
    public void testGetOne() {
        given().//
                spec(requestSpec.build()).//
                when().//
                get("/api/userSessions/self").//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                assertThat().//
                body(matchesJsonSchemaInClasspath("schemas/UserSessionResultSchema.json"))//
                .body("advancement", equalTo(0.0));
    }

    @Test
    public void testAdvanceALot() {
        UserSessionAdvanceModel advanceModel = new UserSessionAdvanceModel();
        advanceModel.setAdvancement(100000.0);
        advanceModel.setChallengeId(challengeId);

        given().//
                spec(requestSpec.build()).//
                body(advanceModel).//
                when().//
                post("/api/userSessions/self/advance").//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                assertThat().//
                body(matchesJsonSchemaInClasspath("schemas/UserSessionResultSchema.json"))//
                .body("advancement", lessThan(100000.0));
    }
}
