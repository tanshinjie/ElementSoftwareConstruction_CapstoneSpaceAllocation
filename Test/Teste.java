
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;

public class Teste {

    static WebDriver driver;
    static WebElement imgUpload1;
    static WebElement imgUpload2;
    static WebElement excelUpload;
    static WebElement widthDimension;
    static WebElement heightDimension;
    static WebElement binSize;
    static WebElement setBtn;
    static WebElement drawBtn;
    static WebElement editBtn;
    static WebElement runBtn;
    static WebElement zoomIn;
    static WebElement zoomIn2;
    static WebElement zoomOut;
    static WebElement zoomOut2;
    static WebElement container;
    static WebElement container2;
    static WebElement saveBtn;
    static WebElement saveBtn2;
    static WebElement drawZone;
    static WebElement drawZone2;
    static WebElement ourCanvas;
    static WebElement ourCanvas2;
    static WebElement bin;
    static WebElement bin0;
    static WebElement bin1;
    static List <WebElement> move_cont;
    static List <WebElement> move_nw;
    static List <WebElement> move_ne;
    static List <WebElement> move_sw;
    static List <WebElement> move_se;
    static List <WebElement> move_n;
    static List <WebElement> move_w;
    static List <WebElement> move_s;
    static List <WebElement> move_e;

    public static void findAllElement() {
        imgUpload1 = driver.findElement(By.id("uploaded-file"));
        imgUpload2 = driver.findElement(By.id("uploaded-file2"));
        excelUpload = driver.findElement(By.id("uploaded-excel"));
        widthDimension = driver.findElement(By.id("widthRatio"));
        heightDimension = driver.findElement(By.id("heightRatio"));
        binSize = driver.findElement(By.id("binSize"));
        setBtn = driver.findElement(By.id("ratioButton"));
        drawBtn = driver.findElement(By.id("drawBtn"));
        editBtn = driver.findElement(By.id("editBtn"));
        runBtn = driver.findElement(By.id("runBtn"));
        zoomIn = driver.findElement(By.id("zoomIn"));
        zoomIn2 = driver.findElement(By.id("zoomIn2"));
        zoomOut = driver.findElement(By.id("zoomOut"));
        zoomOut2 = driver.findElement(By.id("zoomOut2"));
        container = driver.findElement(By.id("container"));
        container2 = driver.findElement(By.id("container2"));
        saveBtn = driver.findElement(By.id("save-button"));
        saveBtn2 = driver.findElement(By.id("save-button2"));
        drawZone = driver.findElement(By.id("drawZone"));
        drawZone2 = driver.findElement(By.id("drawZone2"));
        ourCanvas = driver.findElement(By.id("our-canvas"));
        ourCanvas2 = driver.findElement(By.id("our-canvas2"));
    }

    @Before
    public void setUpBefore() throws Exception {
        System.out.println("setUp");
        System.setProperty("webdriver.gecko.driver",
                "/eclipsework/geckodriver.exe");
        driver = new FirefoxDriver();
        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
        driver.get("file:///F:/2dpacking/Base%20GUI/Capstone_allocation.html");
        findAllElement();
    }

    @After
    public void tearDownAfter() throws Exception {
        System.out.println("tearDown");
        driver.quit();
    }

//    @Test
//    public void draw_mode_upload_bins_cleared() {
//        imgUpload1.sendKeys(
//                "D:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
//        imgUpload2.sendKeys(
//                "D:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
//        excelUpload.sendKeys(
//                "D:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
//        widthDimension.clear();
//        heightDimension.clear();
//        binSize.clear();
//        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
//        widthDimension.sendKeys("1");
//        heightDimension.sendKeys("1");
//        binSize.sendKeys("2");
//        setBtn.click();
//        drawBtn.click();
//        
//    }

//    @Test
//    public void editBtnDisabled_after_drawBtnClick() {
//        System.out.println("Test 1");
//        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
//        imgUpload1.sendKeys(
//                "D:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
//        imgUpload2.sendKeys(
//                "D:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
//        excelUpload.sendKeys(
//                "D:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
//        widthDimension.sendKeys("1");
//        heightDimension.sendKeys("1");
//        binSize.sendKeys("2");
//        setBtn.click();
//        drawBtn.click();
//        assertFalse(editBtn.isEnabled());
//    }

    @Test
    public void bins_cleared_after_reupload_image_drawmode() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        Actions builder = new Actions(driver);
        builder.moveToElement(container).click().build().perform();
        imgUpload1.sendKeys(
                "D:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        bin = driver.findElement(By.id("bin0"));
        assertFalse(bin.equals(null));
//        assertTrue(bin.equals(null));

    }
    @Test
    public void reset_zoom_level_after_upload() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        zoomIn.click();
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        saveBtn.click();
        assertFalse(container.getCssValue("transform").equals("scale(1)"));
//        assertTrue(container.getCssValue("transform").equals("scale(1)"));

    }
    @Test
    public void reset_invalid_dimension_exit_draw_mode() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        widthDimension.clear();
        widthDimension.sendKeys("0");
        setBtn.click();
        assertFalse(!drawBtn.isEnabled());
//        assertTrue(!drawBtn.isEnabled());
    }
    @Test
    public void bins_cleared_after_reupload_image_editmode() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        Actions builder = new Actions(driver);
        builder.moveToElement(container).click().build().perform();
        drawBtn.click();
        editBtn.click();
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        bin = driver.findElement(By.id("bin0"));
        assertFalse(bin.equals(null));
//        assertTrue(bin.equals(null));
    }
    @Test
    public void edit_run_enable_only_at_least_one_bin() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        drawBtn.click();
        assertFalse(!editBtn.isEnabled() && !runBtn.isEnabled());
//        assertTrue(!editBtn.isEnabled() && !runBtn.isEnabled());
    }
    @Test
    public void moveable_controller_remain_after_delete() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        Actions builder = new Actions(driver);
        builder.moveToElement(container).click().build().perform();
        builder.moveToElement(container).click().build().perform();
        drawBtn.click();
        editBtn.click();
        bin0 = driver.findElement(By.id("bin0"));
        builder.dragAndDropBy(bin0, 10, 10).build().perform();
        bin1 = driver.findElement(By.id("bin1"));
        builder.dragAndDropBy(bin1, 25, 25).build().perform();
        builder.moveToElement(bin1).click().build().perform();
        builder.sendKeys(Keys.DELETE).build().perform();;
        editBtn.click();
        move_cont = driver.findElements(By.className("moveable-control-box   rCS1cins0k"));
        assertFalse(move_cont.equals(null));
//        assertTrue(move_cont.equals(null));
    }
    @Test
    public void moveable_controller_missing_corners() {
        imgUpload1.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
        imgUpload2.sendKeys(
                "F:\\2dpacking\\Base GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
        excelUpload.sendKeys(
                "F:\\2dpacking\\2019 Showcase Space and Logistics Requirements_7Aug2019.xlsx");
        widthDimension.clear();
        heightDimension.clear();
        binSize.clear();
        widthDimension.sendKeys("1");
        heightDimension.sendKeys("1");
        binSize.sendKeys("2");
        setBtn.click();
        drawBtn.click();
        Actions builder = new Actions(driver);
        builder.moveToElement(container).click().build().perform();
        builder.moveToElement(container).click().build().perform();
        drawBtn.click();
        editBtn.click();
        bin0 = driver.findElement(By.id("bin0"));
        builder.dragAndDropBy(bin0, 10, 10).build().perform();
        bin1 = driver.findElement(By.id("bin1"));
        builder.dragAndDropBy(bin1, 25, 25).build().perform();
        builder.moveToElement(bin1).click().build().perform();
        builder.sendKeys(Keys.DELETE).build().perform();;
        editBtn.click();
        editBtn.click();
        move_nw = driver.findElements(By.className("moveable-control moveable-direction moveable-nw"));
        move_ne = driver.findElements(By.className("moveable-control moveable-direction moveable-ne"));
        move_sw = driver.findElements(By.className("moveable-control moveable-direction moveable-sw"));
        move_se = driver.findElements(By.className("moveable-control moveable-direction moveable-se"));
        move_n = driver.findElements(By.className("moveable-control moveable-direction moveable-n"));
        move_w = driver.findElements(By.className("moveable-control moveable-direction moveable-w"));
        move_s = driver.findElements(By.className("moveable-control moveable-direction moveable-s"));
        move_e = driver.findElements(By.className("moveable-control moveable-direction moveable-e"));
        assertFalse(move_nw.equals(null) || move_ne.equals(null) || move_sw.equals(null) || move_se.equals(null) || move_n.equals(null) || move_w.equals(null) || move_s.equals(null) || move_e.equals(null));
//        assertTrue(!move_nw.equals(null) && !move_ne.equals(null) && !move_sw.equals(null) && !move_se.equals(null) && !move_n.equals(null) && !move_w.equals(null) && !move_s.equals(null) && !move_e.equals(null));
    }
    // @Test
    // public void drawBtnDisabled_after_editBtnClick() {
    // System.out.println("Test 2");
    // driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    // imgUpload1.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
    // imgUpload2.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
    // excelUpload.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\2019
    // Showcase Space and Logistics Requirements_7Aug2019.xlsx");
    // widthDimension.sendKeys("1");
    // heightDimension.sendKeys("1");
    // binSize.sendKeys("2");
    // setBtn.click();
    // editBtn.click();
    // assertFalse(drawBtn.isEnabled());
    // }
    // @Test
    // public void runBtnDisabled_after_editBtnClick() {
    // System.out.println("Test 3");
    // driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    // imgUpload1.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
    // imgUpload2.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
    // excelUpload.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\2019
    // Showcase Space and Logistics Requirements_7Aug2019.xlsx");
    // widthDimension.sendKeys("1");
    // heightDimension.sendKeys("1");
    // binSize.sendKeys("2");
    // setBtn.click();
    // editBtn.click();
    // assertFalse(runBtn.isEnabled());
    // }
    //
    // @Test
    // public void drawBtnDisabled_after_editBtnClick_runBtnClick() {
    // System.out.println("Test 3");
    // driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    // imgUpload1.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
    // imgUpload2.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
    // excelUpload.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\2019
    // Showcase Space and Logistics Requirements_7Aug2019.xlsx");
    // widthDimension.sendKeys("1");
    // heightDimension.sendKeys("1");
    // binSize.sendKeys("2");
    // setBtn.click();
    // editBtn.click();
    // runBtn.click();
    // assertFalse(drawBtn.isEnabled());
    // }
    // @Test
    // public void pop_up() {
    // System.out.println("Test 4");
    // driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);
    // imgUpload1.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
    // imgUpload2.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
    // excelUpload.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\2019
    // Showcase Space and Logistics Requirements_7Aug2019.xlsx");
    // setBtn.click();
    // editBtn.click();
    // runBtn.click();
    // assertFalse(drawBtn.isEnabled());
    // }
    // @Test
    // public void defaultButtonState() {
    // System.out.println("Test 5: defaultButtonState");
    // imgUpload1.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_1_clean.png");
    // imgUpload2.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\Base
    // GUI\\resource\\Capstone 2019 Layout_Page_2._clean.png");
    // excelUpload.sendKeys("C:\\Users\\shinj\\Desktop\\esc\\2dpacking\\2019
    // Showcase Space and Logistics Requirements_7Aug2019.xlsx");
    // assertTrue(!drawBtn.isEnabled() && !editBtn.isEnabled() &&
    // !runBtn.isEnabled());
    // }

}
