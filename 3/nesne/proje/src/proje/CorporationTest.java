package proje;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

public class CorporationTest {

    private Corporation corporation;

    @Before
    public void setUp() {
        corporation = new Corporation("Melih Corporation", "Kadiköy", 1234, 15, 6, 2022, 56789, "Melih Bank");
    }

    @Test
    public void testGetters() {
        assertEquals("Melih Corporation", corporation.getName());
        assertEquals("Kadiköy", corporation.getAddress());
        assertEquals(1234, corporation.getBankCode());
        assertEquals(15, corporation.getIssueDay());
        assertEquals(6, corporation.getIssueMonth());
        assertEquals(2022, corporation.getIssueYear());
        assertEquals(56789, corporation.getAccountNumber());
        assertEquals("Melih Bank", corporation.getBankName());
    }

    @Test
    public void testBillingInformation() {
        String expectedBillingInfo = "Bank Code: 1234, Bank Name: Melih Bank, Account Number: 56789, Issue Day: 15, Issue Month: 6, Issue Year: 2022";
        assertEquals(expectedBillingInfo, corporation.getBillingInformation());
    }

    @Test
    public void testToString() {
        String expectedToString = "Corporation \nName: Melih Corporation, Address: Kadiköy\nBank Code: 1234, Bank Name: Melih Bank, Account Number: 56789\nIssue Day: 15, Issue Month: 6, Issue Year: 2022";
        assertEquals(expectedToString, corporation.toString());
    }
}
