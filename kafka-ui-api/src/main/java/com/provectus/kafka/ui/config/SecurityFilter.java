package com.provectus.kafka.ui.config;

import com.provectus.kafka.ui.exception.AuthenticationException;
import com.provectus.kafka.ui.util.annotation.Secured;
import java.lang.annotation.Annotation;
import lombok.extern.flogger.Flogger;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class SecurityFilter implements WebFilter {

  private final RequestMappingHandlerMapping mapping;

  public SecurityFilter(@Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping mapping) {
    this.mapping = mapping;
  }

  @Override
  public @NotNull Mono<Void> filter(@NotNull ServerWebExchange exchange, @NotNull WebFilterChain chain) {
    var handlerMethod = (HandlerMethod) mapping.getHandler(exchange).toFuture().getNow(null);

    if (!handlerMethod.hasMethodAnnotation(Secured.class)) {
      log.trace("Method [{}] has no secured annotation", handlerMethod);
      return chain.filter(exchange);
    }

    Secured annotation = handlerMethod.getMethodAnnotation(Secured.class);
    Assert.notNull(annotation, "annotation is not present");

    if (annotation.requiredPermissions().length == 0) {
      log.trace("Method [{}] has no require permissions", handlerMethod);
      return chain.filter(exchange);
    }


    if (false) { // forbidden
      return Mono.error(AuthenticationException::new);
    }

    return chain.filter(exchange);
  }

}
