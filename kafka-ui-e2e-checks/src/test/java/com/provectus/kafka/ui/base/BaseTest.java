package com.provectus.kafka.ui.base;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.WebDriverRunner;
import com.codeborne.selenide.logevents.SelenideLogger;
import com.provectus.kafka.ui.helpers.Helpers;
import com.provectus.kafka.ui.helpers.TestConfiguration;
import com.provectus.kafka.ui.pages.Pages;
import com.provectus.kafka.ui.screenshots.Screenshooter;
import com.provectus.kafka.ui.utils.CamelCaseToSpacedDisplayNameGenerator;
import com.provectus.kafka.ui.utils.qaseIO.TestCaseGenerator;
import io.github.cdimascio.dotenv.Dotenv;
import io.qameta.allure.Allure;
import io.qameta.allure.selenide.AllureSelenide;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.HostPortWaitStrategy;
import org.testcontainers.containers.wait.strategy.LogMessageWaitStrategy;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.containers.wait.strategy.WaitAllStrategy;
import org.testcontainers.containers.wait.strategy.WaitStrategy;
import org.testcontainers.utility.DockerImageName;

@Slf4j
@DisplayNameGeneration(CamelCaseToSpacedDisplayNameGenerator.class)
public class BaseTest {

  protected Pages pages = Pages.INSTANCE;
  protected Helpers helpers = Helpers.INSTANCE;

  private Screenshooter screenshooter = new Screenshooter();

  public void compareScreenshots(String name) {
    screenshooter.compareScreenshots(name);
  }

  @BeforeAll
  public static void start() {
    WebDriverService.start();
  }

  @AfterAll
  public static void tearDown() {
    final BrowserWebDriverContainer<?> webDriverContainer = WebDriverService.getWebDriverContainer();
//    if (webDriverContainer.isRunning()) {
//      webDriverContainer.close();
//      webDriverContainer.stop();
//    }
    // TODO: shutdown hook
  }

  static {
    if (!new File("./.env").exists()) {
      try {
        FileUtils.copyFile(new File(".env.example"), new File(".env"));
      } catch (IOException e) {
        log.error("couldn't copy .env.example to .env. Please add .env");
        e.printStackTrace();
      }
    }
    Dotenv.load().entries().forEach(env -> System.setProperty(env.getKey(), env.getValue()));
    if (TestConfiguration.CLEAR_REPORTS_DIR) {
      clearReports();
    }
    setup();
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      if (TestCaseGenerator.FAILED) {
        log.error(
            "Tests FAILED because some problem with @CaseId annotation. Verify that all tests annotated with @CaseId and Id is correct!");
        Runtime.getRuntime().halt(100500);
      }
    }));
  }

  @AfterEach
  public void afterMethod() {
    final BrowserWebDriverContainer<?> webDriverContainer = WebDriverService.getWebDriverContainer();
    Allure.addAttachment("Screenshot",
        new ByteArrayInputStream(
            ((TakesScreenshot) webDriverContainer.getWebDriver()).getScreenshotAs(OutputType.BYTES)));
  }

  @SneakyThrows
  private static void setup() {
    Configuration.reportsFolder = TestConfiguration.REPORTS_FOLDER;
    Configuration.screenshots = TestConfiguration.SCREENSHOTS;
    Configuration.savePageSource = TestConfiguration.SAVE_PAGE_SOURCE;
    Configuration.reopenBrowserOnFail = TestConfiguration.REOPEN_BROWSER_ON_FAIL;
    Configuration.browser = TestConfiguration.BROWSER;
    Configuration.baseUrl = TestConfiguration.BASE_WEB_URL;
    Configuration.timeout = 10000;
    Configuration.browserSize = TestConfiguration.BROWSER_SIZE;
    SelenideLogger.addListener("allure", new AllureSelenide().savePageSource(false));
  }

  public static void clearReports() {
    log.info(String.format("Clearing reports dir [%s]...", TestConfiguration.REPORTS_FOLDER));
    File allureResults = new File(TestConfiguration.REPORTS_FOLDER);
    if (allureResults.isDirectory()) {
      File[] list = allureResults.listFiles();
      if (list != null) {
        Arrays.stream(list)
            .sequential()
            .filter(e -> !e.getName().equals("categories.json"))
            .forEach(File::delete);
      }
    }
  }

}
