package com.tka.listener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class XLOG {
       public static void main(String[] args) {
	   final Logger logger = LogManager.getLogger(XLOG.class);
	   
	   logger.info("Starting Selenium test...1");
	   logger.trace("Starting Selenium test...2");
	   logger.fatal("Starting Selenium test...3");
	   logger.error("Starting Selenium test...4");
	   logger.warn("Starting Selenium test...5");
	}
}
