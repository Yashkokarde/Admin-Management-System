package com.tka.utilitie;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.safari.SafariDriver;

import com.tka.utilities.prop.PropUtil;

public class SeleniumUtilities {
	final static Logger logger = LogManager.getLogger(SeleniumUtilities.class);
	
	public static  WebDriver openBrowser() {
	
		String brType = PropUtil.valueOfAnyKey("adminmngnt.browsertype");
		logger.info("received br name as " + brType);
		if(brType.equals("chrome")) {
		WebDriver driver = new ChromeDriver();
		return driver;
	} else if(brType.equals("safari")) {
		WebDriver driver = new SafariDriver();
		return driver;
	} else {
		
		WebDriver driver = new FirefoxDriver();
		return driver;
	}
	}
	    public static void openAnyUrl(WebDriver driver , String url){
	    	 driver.get(url);
	     }
	
      public static void clickButton(WebDriver driver ,String xpath) {
		driver.findElement(By.xpath(xpath)).click();		
	}
       public static void enterText(WebDriver driver , String xpath , String data) {
    	   driver.findElement(By.xpath(xpath)).sendKeys(data);
	}
       public static String getAnyText(WebDriver driver , String xpath) {
    	   String txt = driver.findElement(By.xpath(xpath)).getText();
    	   return txt;
       }
}
