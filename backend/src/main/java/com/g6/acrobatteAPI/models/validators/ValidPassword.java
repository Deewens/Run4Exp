package com.g6.acrobatteAPI.models.validators;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.ElementType;

import javax.validation.Constraint;
import javax.validation.Payload;

@Documented
@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({ ElementType.TYPE, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.LOCAL_VARIABLE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "At least one number, one lower case letter, one upper case letter and 8 characters";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
