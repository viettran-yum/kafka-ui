package com.provectus.kafka.ui.base;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;
import org.testcontainers.containers.wait.strategy.LogMessageWaitStrategy;
import org.testcontainers.containers.wait.strategy.WaitAllStrategy;
import org.testcontainers.containers.wait.strategy.WaitStrategy;
import org.testcontainers.utility.DockerImageName;

@Slf4j
public class WebDriverService {

  private static BrowserWebDriverContainer<?> webDriverContainer = null;

  public static final String SELENIUM_IMAGE_NAME = "selenium/standalone-chrome";
  public static final String SELENIARM_STANDALONE_CHROMIUM = "seleniarm/standalone-chromium";


  public static BrowserWebDriverContainer<?> getWebDriverContainer() {
    return webDriverContainer;
  }

  public static void start() {
    if (webDriverContainer != null && webDriverContainer.isRunning()) {
      log.info("Container has already started, skipping");
      return;
    }

    DockerImageName image = isARM64()
        ? DockerImageName.parse(SELENIARM_STANDALONE_CHROMIUM).asCompatibleSubstituteFor(SELENIUM_IMAGE_NAME)
        : DockerImageName.parse(SELENIUM_IMAGE_NAME);
    log.info("Using [{}] as image name for chrome", image.getUnversionedPart());

    webDriverContainer = new BrowserWebDriverContainer<>(image)
        .withEnv("JAVA_OPTS", "-Dwebdriver.chrome.whitelistedIps=")
        .withCapabilities(new ChromeOptions()
            .addArguments("--disable-dev-shm-usage")
            .addArguments("--verbose")
        )
        .withLogConsumer(new Slf4jLogConsumer(log).withPrefix("[CHROME]: ")); // uncomment for debugging

    WaitStrategy logWaitStrategy = (new LogMessageWaitStrategy())
        .withRegEx(".*(RemoteWebDriver instances should connect to|Selenium Server is up and running|Started Selenium Standalone).*\n")
        .withStartupTimeout(Duration.of(25L, ChronoUnit.SECONDS));
    WaitStrategy waitStrategy = (new WaitAllStrategy())
        .withStrategy(logWaitStrategy)
        .withStrategy(new HostPortWaitStrategy())
        .withStartupTimeout(Duration.of(25L, ChronoUnit.SECONDS));

    webDriverContainer.setWaitStrategy(waitStrategy);

    try {
      Testcontainers.exposeHostPorts(8080);
      log.info("Starting browser container");
      webDriverContainer.start();
    } catch (Throwable e) {
      log.error("Couldn't start a container", e);
    }

  }

  private static boolean isARM64() {
    return System.getProperty("os.arch").equals("aarch64");
  }
}
