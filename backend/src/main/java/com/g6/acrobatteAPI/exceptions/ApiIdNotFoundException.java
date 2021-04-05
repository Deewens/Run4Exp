package com.g6.acrobatteAPI.exceptions;

import lombok.Data;

@Data
public class ApiIdNotFoundException extends Exception {
    private static final long serialVersionUID = -2880580182265099281L;

    private String param;
    private String description;
    private Long id;
    public final static Integer code = 404;
    public final static String slug = "idNotFound";

    public ApiIdNotFoundException(String param, Long id) {
        this(param, id, null);
    }

    public ApiIdNotFoundException(String param, Long id, String description) {
        this.param = param;
        this.description = description;
        this.id = id;
    }

    @Override
    public String getMessage() {
        String message = "Entité [" + param + "] avec ID [" + id + "] n'existe pas";
        message += description == null ? "" : "; Détails: " + description;

        return message;
    }
}
