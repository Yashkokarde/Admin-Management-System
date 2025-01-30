package com.tka.utilities.prop;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropUtil {
      public static String valueOfAnyKey(String anyKey)  {
    	  InputStream inputStream =PropUtil.class.getClassLoader().getResourceAsStream("Confic.properties");
    	  Properties properties = new Properties();
    	  try {
    		  properties.load(inputStream);
    	  } catch(IOException e) {
    		  e.printStackTrace();
    	  }
    	     return properties.getProperty(anyKey);
       }
}
