package com.tka.listeners.test;

import java.util.Date;

import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TrackTestCases implements ITestListener {
        
	@Override
        public void onTestStart(ITestResult result) {
        	System.out.println("test case >> " + result.getName() + "started at" + new Date());
        }
	 @Override
	public void onFinish(ITestContext context) {
			System.out.println("test case >> " + context.getName() + "started at" + new Date());
	}
}
