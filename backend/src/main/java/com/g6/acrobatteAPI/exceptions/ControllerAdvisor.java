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

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());

        List<String> errors = ex.getBindingResult().getFieldErrors().stream().map(x -> x.getDefaultMessage())
                .collect(Collectors.toList());

        body.put("errors", errors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDBIntegrityException(DataIntegrityViolationException ex, WebRequest request) {

        String message = "Data Intergrity Violation exception: " + ex.getMessage();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", message);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
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

    @ExceptionHandler(ApiNoResponseException.class)
    public ResponseEntity<Object> handleDBIntegrityException(ApiNoResponseException ex, WebRequest request) {

        String message = ex.getMessage();

        ErrorResponse response = new ErrorResponse();
        response.setError(message);
        response.setTimestamp(LocalDateTime.now());
        response.setCode(ApiNoResponseException.code);
        response.setSlug(ApiNoResponseException.slug);

        return new ResponseEntity<>(response, null, ApiNoResponseException.code);
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