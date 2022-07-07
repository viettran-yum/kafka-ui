package com.provectus.kafka.ui.util.annotation;

import com.provectus.kafka.ui.util.enums.Permission;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Secured {

  Permission[] requiredPermissions();

}
