package com.g6.acrobatteAPI.exceptions;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.ValidationException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

    /**
     * Intercepteur d'erreurs ejectées par Hibernate Validator *
     * 
     * @param ex: exception MethodArgumentNotValidException
     * @return: erreur sous forme de JSON
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request) {

        String message = ex.getBindingResult().getFieldErrors().stream().map(x -> x.getDefaultMessage())
                .collect(Collectors.joining(" , "));

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);
        response.setSlug("invalidDatabaseData");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDBIntegrityException(DataIntegrityViolationException ex, WebRequest request) {

        String message = "Data Intergrity Violation exception: " + ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);
        response.setSlug("invalidDatabaseIntegrity");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleBeanValidationException(ValidationException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        String message = "Erreur validation de données: " + ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);
        response.setSlug("invalidData");

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Intercepteur d'erreurs ejectées quand il y a un problème de génération de
     * réponse
     * 
     * @param ex: exception ApiNoResponseException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiNoResponseException.class)
    public ResponseEntity<Object> handleApiNoResponseException(ApiNoResponseException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiNoResponseException.code);
        response.setSlug(ApiNoResponseException.slug);

        return new ResponseEntity<>(response, null, ApiNoResponseException.code);
    }

    /**
     * Intercepteur d'erreurs ejectées quand on arrive pas à trouver une entité par
     * ID
     * 
     * @param ex: exception ApiIdNotFoundException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiIdNotFoundException.class)
    public ResponseEntity<Object> handleIdNotFoundException(ApiIdNotFoundException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiIdNotFoundException.code);
        response.setSlug(ApiIdNotFoundException.slug);

        return new ResponseEntity<>(response, null, ApiIdNotFoundException.code);
    }

    /**
     * Intercepteur d'erreurs ejectées quand l'utilisateur a besoin de droits admin
     * pour effectuer une action réponse
     * 
     * @param ex: exception ApiNotAdminException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiNotAdminException.class)
    public ResponseEntity<Object> handleNotAdminException(ApiNotAdminException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiNotAdminException.code);
        response.setSlug(ApiNotAdminException.slug);

        return new ResponseEntity<>(response, null, ApiNotAdminException.code);
    }

    /**
     * Intercepteur d'erreurs ejectées quand une entité fait déjà partie du parent
     * et on essaye de la rajouter une deuxième fois
     * 
     * @param ex: exception ApiAlreadyExistsException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiAlreadyExistsException.class)
    public ResponseEntity<Object> handleNotAdminException(ApiAlreadyExistsException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiAlreadyExistsException.code);
        response.setSlug(ApiAlreadyExistsException.slug);

        return new ResponseEntity<>(response, null, ApiAlreadyExistsException.code);
    }

    /**
     * Intercepteur d'erreurs ejectées quand une erreur de traitement de fichier
     * s'est produite et on essaye de la rajouter une deuxième fois
     * 
     * @param ex: exception ApiFileException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiFileException.class)
    public ResponseEntity<Object> handleNotAdminException(ApiFileException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiFileException.code);
        response.setSlug(ApiFileException.slug);

        return new ResponseEntity<>(response, null, ApiFileException.code);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {

        ErrorResponse response = new ErrorResponse();
        response.setCode(400);
        response.setError(ex.getMessage());
        response.setTimestamp(LocalDateTime.now());
        response.setSlug("noErrorMapping");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}