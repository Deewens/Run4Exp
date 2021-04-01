package com.g6.acrobatteAPI.rest;

import static io.restassured.RestAssured.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

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
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;

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
public class ChallengeControllerTest {
    @LocalServerPort
    private int port;

    @Autowired
    TokenProvider tokenProvider;

    private RequestSpecBuilder requestSpec = new RequestSpecBuilder();
    private final String challenge1Name = "Challenge1";
    private final String createdChallengeName = "Challenge3";

    @Before
    public void setup() {
        requestSpec.setPort(port).addHeader("Authorization", tokenProvider.getToken(true))
                .addHeader("Accept", "application/json").setContentType(ContentType.JSON);
    }

    @Test
    public void testGetAll() {
        given().spec(requestSpec.build()).when().get("/api/challenges").then().log().ifValidationFails().statusCode(200)
                .body("_embedded.challengeResponseModelList.name", hasItems(challenge1Name));
    }

    @Test
    public void testGetOne() {
        given().//
                spec(requestSpec.build()).//
                when().//
                get("/api/challenges/{id}", 1).//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                assertThat().//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeGetSchema.json"))//
                .body("name", equalTo(challenge1Name));
    }

    @Test
    public void testCreate() {
        ChallengeCreateModel challengeCreateModel = new ChallengeCreateModel();
        challengeCreateModel.setName(createdChallengeName);
        challengeCreateModel.setDescription("CCCDescription");
        challengeCreateModel.setScale(5.4);

        given().//
                spec(requestSpec.build()).//
                body(challengeCreateModel).//
                when().//
                post("/api/challenges").//
                then().//
                log().//
                ifValidationFails().statusCode(200).//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeCreateSchema.json"))//
                .body("name", equalTo(createdChallengeName));
    }

    @Test
    public void testGetDetail() {
        given().//
                spec(requestSpec.build()).//
                when().//
                get("/api/challenges/{id}/detail", 1).//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeGetDetailSchema.json"))//
                .body("name", equalTo(challenge1Name));
    }
}
