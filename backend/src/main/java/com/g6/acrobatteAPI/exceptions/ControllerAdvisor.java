package com.g6.acrobatteAPI.exceptions;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.ValidationException;

import com.g6.acrobatteAPI.models.error.ErrorFieldModel;
import com.g6.acrobatteAPI.models.error.ErrorModel;
import com.g6.acrobatteAPI.models.error.ErrorMultipleResponseModel;
import com.g6.acrobatteAPI.models.error.ErrorResponseModel;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
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

        ErrorMultipleResponseModel response = new ErrorMultipleResponseModel();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            ErrorFieldModel errorModel = new ErrorFieldModel();
            errorModel.setError(fieldError.getDefaultMessage());
            errorModel.setField(fieldError.getField());
            errorModel.setSlug("invalidRequestBody");

            response.getErrors().add(errorModel);
        }

        String message = ex.getBindingResult().getFieldErrors().stream().map(x -> x.getDefaultMessage())
                .collect(Collectors.joining(" , "));

        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);
        response.setSlug("invalidRequestBody");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDBIntegrityException(DataIntegrityViolationException ex, WebRequest request) {

        String message = "Data Intergrity Violation exception: " + ex.getMessage();

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug("invalidPersistence");
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> handleBeanValidationException(ValidationException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        String message = "Erreur validation de données: " + ex.getMessage();

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug("invalidRequestBody");
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(400);

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

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiNoResponseException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiNoResponseException.code);

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

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiIdNotFoundException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiIdNotFoundException.code);

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

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiNotAdminException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiNotAdminException.code);

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

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiAlreadyExistsException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiAlreadyExistsException.code);

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

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiFileException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiFileException.code);

        return new ResponseEntity<>(response, null, ApiFileException.code);
    }

    /**
     * Intercepteur d'erreurs ejectées quand il y a une erreur de traitement de
     * paramètre de requête s'est produite
     * 
     * @param ex: exception ApiWrongParamsException
     * @return: erreur sous forme de JSON
     */
    @ExceptionHandler(ApiWrongParamsException.class)
    public ResponseEntity<Object> handleWrongParamException(ApiWrongParamsException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug(ApiWrongParamsException.slug);
        response.setError(error);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiWrongParamsException.code);

        return new ResponseEntity<>(response, null, ApiWrongParamsException.code);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String message = ex.getMessage();

        ErrorResponseModel response = new ErrorResponseModel();
        ErrorModel error = new ErrorModel();
        error.setError(message);
        error.setSlug("noErrorMapping");
        response.setError(error);
        response.setCode(400);
        response.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}