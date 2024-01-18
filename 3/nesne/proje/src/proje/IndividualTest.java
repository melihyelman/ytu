package proje;

import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

public class IndividualTest {

    private Individual individual;

    @Before
    public void setUp() {
        individual = new Individual("Melih Yelman", "Kadikoy", "1234567890123456", 10, 2024, 123);
    }

    @Test
    public void testGetters() {
        assertEquals("Melih Yelman", individual.getName());
        assertEquals("Kadikoy", individual.getAddress());
        assertEquals("1234567890123456", individual.getCreditCardNr());
        assertEquals(10, individual.getExpireMonth());
        assertEquals(2024, individual.getExpireYear());
        assertEquals(123, individual.getCCV());
    }

    @Test
    public void testToString() {
        String expectedToString = "Individual \nName: Melih Yelman, Address: Kadikoy\nCredit Card Number: 1234567890123456, Expire Month: 10, Expire Year: 2024, CCV: 123";
        assertEquals(expectedToString, individual.toString());
    }

    @Test
    public void testBillingInformation() {
        String expectedBillingInfo = "Credit Card Number: 1234567890123456, Expire Month: 10, Expire Year: 2024, CCV: 123";
        assertEquals(expectedBillingInfo, individual.getBillingInformation());
    }
}
