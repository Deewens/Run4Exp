package com.g6.acrobatteAPI.exceptions;

import lombok.Data;

@Data
public class ApiAlreadyExistsException extends Exception {
    private static final long serialVersionUID = -1215922784566270141L;
    private String param;
    private String description;
    private String parent;
    public final static Integer code = 400;
    public final static String slug = "alreadyExists";

    public ApiAlreadyExistsException(String param, String parent) {
        this(param, parent, null);
    }

    public ApiAlreadyExistsException(String param, String parent, String description) {
        this.param = param;
        this.description = description;
        this.parent = parent;
    }

    @Override
    public String getMessage() {
        String message = "Entité [" + param + "] fait partie déjà de [" + parent + "]";
        message += description == null ? "" : "; Détails: " + description;

        return message;
    }
}
