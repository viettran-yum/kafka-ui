package com.provectus.kafka.ui.exception;

import static com.provectus.kafka.ui.exception.ErrorCode.FORBIDDEN;

public class AuthenticationException extends CustomBaseException {
  @Override
  public ErrorCode getErrorCode() {
    return FORBIDDEN;
  }
}
