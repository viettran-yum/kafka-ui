package com.provectus.kafka.ui.model.rbac;

import org.apache.commons.lang3.EnumUtils;
import org.jetbrains.annotations.Nullable;

public enum Provider {

  OAUTH_GOOGLE,
  OAUTH_GITHUB,

  LDAP,
  LDAP_AD;

  @Nullable
  public Provider fromString(String name) {
    return EnumUtils.getEnum(Provider.class, name);
  }

}
