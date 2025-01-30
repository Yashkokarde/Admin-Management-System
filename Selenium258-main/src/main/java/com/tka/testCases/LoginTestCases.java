package com.tka.testCases;



import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.tka.utilitie.SeleniumUtilities;

public class LoginTestCases {
     @Test
      public void checksubheadingText() {
    	// WebDriver driver = new ChromeDriver();
    	 WebDriver driver = SeleniumUtilities.openBrowser();
    	 SeleniumUtilities.openAnyUrl(driver, "https://javabykiran.com/liveproject/pages/examples/logout.html");
    	 driver.get("https://javabykiran.com/liveproject/pages/examples/logout.html");
    	 String actText = SeleniumUtilities.getAnyText(driver, "/html/body/div/div[2]/p[1]");
    	 String expText = "Sign in to start your session";// from BRD
 		Assert.assertEquals(actText, expText);
     }
     
        @Test
         public void verifyValidLogin() {
        	 WebDriver driver = SeleniumUtilities.openBrowser();
        	 SeleniumUtilities.openAnyUrl(driver, "https://javabykiran.com/liveproject/pages/examples/logout.html");
        	 SeleniumUtilities.enterText(driver,"//*[@id=\"email\"]" , "dishabadhe070@gmail.com" );
        }
} 
