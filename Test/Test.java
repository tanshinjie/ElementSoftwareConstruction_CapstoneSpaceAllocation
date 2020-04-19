// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.firefox.FirefoxDriver;
// import java.util.Random;

// public class Test {
// public static void main(String[] args) throws InterruptedException {
// System.setProperty("webdriver.gecko.driver",
// "/eclipsework/geckodriver.exe");
// WebDriver driver = new FirefoxDriver();
// driver.get("file:///D:/2dpacking/Base%20GUI/Capstone_allocation.html");
// Random r = new Random();
// //a
// WebElement imgUpload1 = driver.findElement(By.id("uploaded-file"));
// imgUpload1.sendKeys("D:\\2dpacking\\Base GUI\\Capstone 2019
// Layout_Page_1_clean.png");
// Thread.sleep(2000);
// //b
// WebElement imgUpload2 = driver.findElement(By.id("uploaded-file2"));
// imgUpload2.sendKeys("D:\\2dpacking\\Base GUI\\Capstone 2019
// Layout_Page_2._clean.png");
// Thread.sleep(2000);
// //c
// WebElement container = driver.findElement(By.id("container"));
// //d
// WebElement container2 = driver.findElement(By.id("container2"));
// //e
// WebElement excelUpload = driver.findElement(By.id("uploaded-excel"));
// excelUpload.sendKeys("D:\\2dpacking\\2019 Showcase Space and Logistics
// Requirements_7Aug2019.xlsx");
// //f
// //g
// WebElement runBtn = driver.findElement(By.id("runBtn"));
// runBtn.click();
// //h
// WebElement saveBtn = driver.findElement(By.id("save-button"));
// saveBtn.click();
// //i
// WebElement saveBtn2 = driver.findElement(By.id("save-button2"));
// saveBtn2.click();
// //j
// WebElement drawBtn = driver.findElement(By.id("drawBtn"));
// drawBtn.click();
// //k
// //l
// //m
// WebElement editBtn = driver.findElement(By.id("editBtn"));
// editBtn.click();
// //n
// //o
// //p
// WebElement zin = driver.findElement(By.id("zoomIn"));
// zin.click();
// //q
// WebElement zout = driver.findElement(By.id("zoomOut"));
// zout.click();
// //r
// WebElement zin2 = driver.findElement(By.id("zoomIn2"));
// zin2.click();
// //s
// WebElement zout2 = driver.findElement(By.id("zoomOut2"));
// zout2.click();
// //t
// //u
// //v
// WebElement binSize = driver.findElement(By.id("binSize"));
// int newRatio = r.nextInt(401)+100;
// String newRat = Integer.toString(newRatio);
// binSize.sendKeys("value", newRat);
// //w
// WebElement ratioBtn = driver.findElement(By.id("ratioButton"));
// ratioBtn.click();
// }

// }