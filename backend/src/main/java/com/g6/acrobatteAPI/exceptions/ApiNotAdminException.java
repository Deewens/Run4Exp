package com.g6.acrobatteAPI.exceptions;

import lombok.Data;

@Data
public class ApiNotAdminException extends Exception {
    private static final long serialVersionUID = -4209630648552363241L;
    private String username;
    private String description;
    public final static Integer code = 400;
    public final static String slug = "notAdmin";

    public ApiNotAdminException(String username) {
        this(username, null);
    }

    public ApiNotAdminException(String username, String description) {
        this.username = username;
        this.description = description;
    }

    @Override
    public String getMessage() {
        username = username == null ? "inconnu" : username;

        String message = "Utilisateur [" + username
                + "] a besoin de droits d'administrateur pour effectuer cette action";
        message += description == null ? "" : "; Détails: " + description;

        return message;
    }
}
