package proje;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

public class SubscriptionTest {

	private Subscription subscription;
	private DateInfo dateInfo;
	private Journal journal;
	private Subscriber subscriber;

	@Before
	public void setUp() {
		dateInfo = new DateInfo(1, 2022);
		journal = new Journal("Melih News", "123456789", 2, 20.0);
		subscriber = new Individual("Melih Yelman", "Kadikoy", "1234567890123456", 10, 2024, 123);
		subscription = new Subscription(dateInfo, 2, journal, subscriber);
	}

	@Test
	public void testGetters() {
		assertEquals(dateInfo, subscription.getDates());
		assertEquals(2, subscription.getCopies());
		assertEquals(journal, subscription.getJournal());
		assertEquals(subscriber, subscription.getSubscriber());
		assertEquals(null, subscription.getPayment());
	}

	@Test
	public void testAcceptPayment() {
		assertFalse(subscription.acceptPayment(5.0));
		PaymentInfo payment = new PaymentInfo(10.0, 0);
		subscription.setPayment(payment);
		assertEquals(10.0, subscription.getPayment().getReceivedPayment(), 0.001);

		assertFalse(subscription.acceptPayment(-10.0)); 
		assertFalse(subscription.acceptPayment(75.0));
	}

	@Test
	public void testSetPayment() {
		PaymentInfo payment = new PaymentInfo(25.0, 0.1);
		assertTrue(subscription.setPayment(payment));
		assertEquals(payment, subscription.getPayment());
	}

	@Test
	public void testCanSend() {
		assertFalse(subscription.canSend(1)); 
		PaymentInfo payment = new PaymentInfo(20.0, 0);
		subscription.setPayment(payment);
		assertTrue(subscription.canSend(1));
		assertFalse(subscription.canSend(2));
	}

	@Test
	public void testIncreaseCopies() {
		assertEquals(2, subscription.getCopies());
		subscription.increaseCopies();
		assertEquals(3, subscription.getCopies());
	}

	@Test
	public void testToString() {
		String expectedToString = "Start Year:2022, Start Month: 1, End Month:12, Copies: 2\nJournal Name:Melih News, Subscriber Name:Melih Yelman";
		assertEquals(expectedToString, subscription.toString());
	}
}
