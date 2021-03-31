package com.g6.acrobatteAPI.exceptions;

import lombok.Data;

@Data
public class ApiFileException extends Exception {
    private static final long serialVersionUID = 6856922892246478059L;
    private String filename;
    private Long size;
    private String description;
    public final static Integer code = 400;
    public final static String slug = "fileError";

    public ApiFileException(String filename) {
        this(filename, null, null);
    }

    public ApiFileException(String filename, Long size) {
        this(filename, size, null);
    }

    public ApiFileException(String filename, Long size, String description) {
        this.filename = filename;
        this.size = size;
        this.description = description;
    }

    @Override
    public String getMessage() {
        String message = "Fichier [" + filename + "] a produit une erreur lors de son traitement";
        message += size == null ? "" : "; Taille [byte]: " + size;
        message += description == null ? "" : "; Détails: " + description;

        return message;
    }
}
