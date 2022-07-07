package com.provectus.kafka.ui.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.provectus.kafka.ui.model.rbac.Role;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccessControlService {
  
  private final Environment environment;

  @PostConstruct
  public void init() {
    String rawProperty = environment.getProperty("roles.file");
    if (rawProperty == null) {
      log.trace("No roles file is provided");
      return;
    }

    Path rolesFilePath = Paths.get(rawProperty);

    if (Files.notExists(rolesFilePath)) {
      log.error("Roles file path provided but the file doesn't exist");
      throw new IllegalArgumentException();
    }

    if (!Files.isReadable(rolesFilePath)) {
      log.error("Roles file path provided but the file isn't readable");
      throw new IllegalArgumentException();
    }

    var mapper = new ObjectMapper(new YAMLFactory());
    mapper.findAndRegisterModules();
    mapper.readValue(rolesFilePath.toFile(), new TypeReference<List<Role>>(){});


  }

}
