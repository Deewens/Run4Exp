package com.g6.acrobatteAPI.exceptions;

import lombok.Data;

@Data
public class ApiWrongParamsException extends Exception {
    private static final long serialVersionUID = 5775125207812018876L;
    private String param;
    private String correctValue;
    private String description;
    public final static Integer code = 400;
    public final static String slug = "wrongParams";

    public ApiWrongParamsException(String param) {
        this(param, null, null);
    }

    public ApiWrongParamsException(String param, String correctValue) {
        this(param, correctValue, null);
    }

    public ApiWrongParamsException(String param, String correctValue, String description) {
        this.param = param;
        this.correctValue = correctValue;
        this.description = description;
    }

    @Override
    public String getMessage() {
        String message = "Paramètre [" + param + "] a produit une erreur lors de son traitement";
        message += correctValue == null ? "" : "; Exemple valeur correcte: " + correctValue;
        message += description == null ? "" : "; Détails: " + description;

        return message;
    }
}
