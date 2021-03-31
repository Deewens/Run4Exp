package com.g6.acrobatteAPI.exceptions;

import java.util.Date;

import lombok.Data;

/**
 * Classe custom d'exception Utilisation: quand les paramètres sont bons, mais
 * il y a pépin lors du traitement de la réponse **************************
 * Exemple: je veux récupérer l'image du challenge en base64 -> image = null ->
 * ApiNoResponseException
 */
@Data
public class ApiNoResponseException extends Exception {
    private static final long serialVersionUID = -2880580182265099281L;

    private String responseParam;
    private String description;
    public final static Integer code = 404;
    public final static String slug = "noResponse";

    public ApiNoResponseException(String responseParam, String description) {
        this.responseParam = responseParam;
        this.description = description;
    }

    @Override
    public String getMessage() {
        String message = "Erreur lors du traitement de la réponse [" + responseParam + "] ";
        message += "Détails: " + description;

        return message;
    }
}
