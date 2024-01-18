package proje;

import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;

public class PaymentInfoTest {

	private PaymentInfo paymentInfo;

	@Before
	public void setUp() {
		paymentInfo = new PaymentInfo(100.0, 0.1);
	}

	@Test
	public void testIncreasePayment() {
		paymentInfo.increasePayment(50.0);
		assertEquals(150.0, paymentInfo.getReceivedPayment(), 0.001);
	}

	@Test
	public void testGetReceivedPayment() {
		assertEquals(100.0, paymentInfo.getReceivedPayment(), 0.001);
	}

	@Test
	public void testGetDiscountRatio() {
		assertEquals(0.1, paymentInfo.getDiscountRatio(), 0.001);
	}

	@Test
	public void testDiscountRatioNormalization() {
		PaymentInfo infoWithInvalidDiscount = new PaymentInfo(200.0, 150.0);
		assertEquals(1, infoWithInvalidDiscount.getDiscountRatio(), 0.001); 
																				

		PaymentInfo infoWithNegativeDiscount = new PaymentInfo(200.0, -0.2); 
		assertEquals(0.0, infoWithNegativeDiscount.getDiscountRatio(), 0.001); 
	}
}
