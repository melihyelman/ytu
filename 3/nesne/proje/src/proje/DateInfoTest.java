package proje;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

public class DateInfoTest {

    private DateInfo dateInfo;

    @Before
    public void setUp() {
        dateInfo = new DateInfo(5, 2022);
    }

    @Test
    public void testGetters() {
        assertEquals(5, dateInfo.getStartMonth());
        assertEquals(4, dateInfo.getEndMonth()); 
        assertEquals(2022, dateInfo.getStartYear());
    }

    @Test
    public void testEndMonthWithJanuary() {
        DateInfo dateWithJanuary = new DateInfo(1, 2022);
        assertEquals(1, dateWithJanuary.getStartMonth());
        assertEquals(12, dateWithJanuary.getEndMonth()); 
        assertEquals(2022, dateWithJanuary.getStartYear());
    }

    @Test
    public void testEndMonthWithNegativeStartMonth() {
        DateInfo dateWithNegativeStartMonth = new DateInfo(-3, 2022);
        assertEquals(-3, dateWithNegativeStartMonth.getStartMonth());
        assertEquals(12, dateWithNegativeStartMonth.getEndMonth()); 
        assertEquals(2022, dateWithNegativeStartMonth.getStartYear());
    }
}
