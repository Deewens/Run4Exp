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
public class ChallengeControllerTest {
    @LocalServerPort
    private int port;

    @Autowired
    TokenProvider tokenProvider;

    private RequestSpecBuilder requestSpec = new RequestSpecBuilder();
    private final String challengeAdminNoImageName = "Challenge1";
    private final Long challengeAdminNoImageId = 1L;

    private final String challengeAdminWithImageName = "Challenge3";
    private final Long challengeAdminWithImageId = 3L;

    private final String createdChallengeName = "Challenge4";
    private final String createdChallengeDescription = "DDDDescription";

    private final String errorNoResponseSlug = "noResponse";

    @Before
    public void setup() {
        requestSpec.setPort(port).addHeader("Authorization", tokenProvider.getToken(true))
                .addHeader("Accept", "application/json").setContentType(ContentType.JSON);
    }

    @Test
    public void testGetAll() {
        given().spec(requestSpec.build()).when().get("/api/challenges").then().log().ifValidationFails().statusCode(200)
                .body("_embedded.challengeResponseModelList.name", hasItems(challengeAdminNoImageName));
    }

    @Test
    public void testGetOne() {
        given().//
                spec(requestSpec.build()).//
                when().//
                get("/api/challenges/{id}", challengeAdminNoImageId).//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                assertThat().//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeGetSchema.json"))//
                .body("name", equalTo(challengeAdminNoImageName));
    }

    @Test
    public void testCreate() {
        ChallengeCreateModel challengeCreateModel = new ChallengeCreateModel();
        challengeCreateModel.setName(createdChallengeName);
        challengeCreateModel.setDescription(createdChallengeDescription);
        challengeCreateModel.setShortDescription("Shiort");
        challengeCreateModel.setScale(5.4);

        given().//
                spec(requestSpec.build()).//
                body(challengeCreateModel).//
                when().//
                post("/api/challenges").//
                then().//
                log().//
                ifValidationFails().statusCode(200).//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeCreateSchema.json")).//
                body("name", equalTo(createdChallengeName)).//
                body("description", equalTo(createdChallengeDescription));
    }

    @Test
    public void testGetDetail() {
        given().//
                spec(requestSpec.build()).//
                when().//
                get("/api/challenges/{id}/detail", challengeAdminNoImageId).//
                then().//
                log().ifValidationFails().//
                statusCode(200).//
                body(matchesJsonSchemaInClasspath("schemas/ChallengeGetDetailSchema.json"))//
                .body("name", equalTo(challengeAdminNoImageName));
    }

    @Test
    public void testGetEmptyImage() {
        given().//
                spec(requestSpec.build()).//
                headers("Accept", "").//
                when().//
                get("/api/challenges/{id}/background", challengeAdminNoImageId).//
                then().//
                log().ifValidationFails().//
                statusCode(404).//
                body(matchesJsonSchemaInClasspath("schemas/ErrorSchema.json"))//
                .body("error.slug", equalTo(errorNoResponseSlug));
    }

    @Test
    public void testGetEmptyImageBase64() {
        given().//
                spec(requestSpec.build()).//
                queryParam("base64", true).//
                header("Accept", "").//
                when().//
                get("/api/challenges/{id}/background", challengeAdminNoImageId).//
                then().//
                log().ifValidationFails().//
                statusCode(404).//
                body(matchesJsonSchemaInClasspath("schemas/ErrorSchema.json"))//
                .body("error.slug", equalTo(errorNoResponseSlug));
    }

    @Test
    public void testGetImage() {
        given().//
                spec(requestSpec.build()).//
                header("Accept", "").//
                when().//
                get("/api/challenges/{id}/background", challengeAdminWithImageId).//
                then().//
                statusCode(200).//
                contentType("image/jpeg");
    }

    @Test
    public void testGetImageBase64() {
        given().//
                spec(requestSpec.build()).//
                queryParam("base64", true).//
                header("Accept", "").//
                when().//
                get("/api/challenges/{id}/background", challengeAdminWithImageId).//
                then().//
                statusCode(200).//
                contentType(ContentType.JSON).//
                body(matchesJsonSchemaInClasspath("schemas/BackgroundBase64Schema.json"));
    }

    @Test
    public void testPutImageBase64() {
        Resource file = new ClassPathResource("muskWeed.jpg");
        var multipartSpec = new MultiPartSpecBuilder(file).fileName("muskWeed.jpg").controlName("file")
                .mimeType("image/jpg").charset("UTF-8");

        try {
            given().//
                    spec(requestSpec.build()).//
                    multiPart(multipartSpec.build()).//
                    // contentType("multipart+").//
                    log().all().header("Accept", "").//
                    when().//
                    put("/api/challenges/{id}/background", challengeAdminWithImageId).//
                    then().//
                    statusCode(200);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
