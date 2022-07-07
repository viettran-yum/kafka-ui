package com.provectus.kafka.ui.model.rbac;

import lombok.Value;

@Value
public class Subject {

  Provider provider;
  String type;
  String value;

}
