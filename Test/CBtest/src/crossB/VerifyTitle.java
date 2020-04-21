package crossB;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
public class VerifyTitle {
	
	WebDriver driver;
	
	@Test
	@Parameters("browser")
	public void verifypageTitle(String browserName) {
		
		if (browserName.equalsIgnoreCase("firefox")) {
			System.setProperty("webdriver.gecko.driver","/eclipsework/CBtest/Driver/geckodriver.exe");
			driver=new FirefoxDriver();
		}
		else if(browserName.equalsIgnoreCase("chrome")) {
			System.setProperty("webdriver.chrome.driver","/eclipsework/CBtest/Driver/chromedriver.exe");
			driver=new ChromeDriver();
		}
		else if(browserName.equalsIgnoreCase("edge")) {
			System.setProperty("webdriver.edge.driver","/eclipsework/CBtest/Driver/msedgedriver.exe");
			driver=new EdgeDriver();
		}
		
		driver.manage().window().maximize();
		
		driver.get("file:///D:/2dpacking/Base%20GUI/Capstone_allocation.html");
		System.out.println(driver.getTitle());
		driver.quit();
		
	}

}
