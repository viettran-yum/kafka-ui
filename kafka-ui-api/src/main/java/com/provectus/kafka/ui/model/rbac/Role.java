package com.provectus.kafka.ui.model.rbac;

import java.util.List;
import lombok.Value;

@Value
public class Role {

  String name;
  List<String> clusters;
  List<Subject> subjects;
  List<Resource> permissions;


}
