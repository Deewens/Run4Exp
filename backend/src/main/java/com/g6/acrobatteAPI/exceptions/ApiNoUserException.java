package com.g6.acrobatteAPI.exceptions;

public class ApiNoUserException extends Exception {
    private static final long serialVersionUID = 6856922892246479059L;
    public static final Integer CODE = 403;
    public static final String SLUG = "fnoUserError";

    @Override
    public String getMessage() {
        return "L'utilisateur est introuvable";
    }
}
