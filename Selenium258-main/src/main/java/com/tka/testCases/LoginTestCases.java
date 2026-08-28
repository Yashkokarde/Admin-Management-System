package com.tka.testCases;

import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.tka.utilitie.SeleniumUtilities;
import com.tka.utilities.prop.PropUtil;

public class LoginTestCases {

	private WebDriver driver;

	private String baseUrl() {
		String url = PropUtil.valueOfAnyKey("adminmngnt.baseurl");
		if (url == null || url.isBlank()) {
			url = "http://127.0.0.1:8080/pages/examples/logout.html";
		}
		return url;
	}

	@AfterMethod
	public void closeBrowser() {
		if (driver != null) {
			driver.quit();
		}
	}

	@Test
	public void checksubheadingText() {
		driver = SeleniumUtilities.openBrowser();
		SeleniumUtilities.openAnyUrl(driver, baseUrl());
		String actText = SeleniumUtilities.getAnyText(driver, "/html/body/div/div[2]/p[1]");
		String expText = "Sign in to start your session";
		Assert.assertEquals(actText, expText);
	}

	@Test
	public void verifyValidLogin() {
		driver = SeleniumUtilities.openBrowser();
		SeleniumUtilities.openAnyUrl(driver, baseUrl());
		SeleniumUtilities.enterText(driver, "//*[@id=\"email\"]", PropUtil.valueOfAnyKey("adminmngnt.email"));
		SeleniumUtilities.enterText(driver, "//*[@id=\"password\"]", PropUtil.valueOfAnyKey("adminmngnt.password"));
		SeleniumUtilities.clickButton(driver, "//*[@id=\"signin\"]");
		Assert.assertTrue(driver.getCurrentUrl().contains("dashboard.html"));
	}
}
