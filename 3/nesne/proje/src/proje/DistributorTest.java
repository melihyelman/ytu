package proje;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

public class DistributorTest {

	private Distributor distributor;
	private Journal sampleJournal;
	private Subscriber subscriberMelih;
	private DateInfo dateInfo;
	private Subscription subscription;

	@Before
	public void setUp() {
		distributor = new Distributor();
		dateInfo = new DateInfo(1, 2024);
		sampleJournal = new Journal("Melih News", "123456789", 2, 20.0);
		subscriberMelih = new Individual("Melih Yelman", "Kadikoy", "1234567890123456", 10, 2024, 123);
		subscription = new Subscription(dateInfo, 2, sampleJournal, subscriberMelih);
	}

	@Test
	public void testAddJournal() {
		assertTrue(distributor.addJournal(sampleJournal));
		assertFalse(distributor.addJournal(sampleJournal));
	}

	@Test
	public void testSearchJournal() {
		distributor.addJournal(sampleJournal);
		assertEquals(sampleJournal, distributor.searchJournal("123456789"));
		assertEquals(null, distributor.searchJournal("987-654-321"));
	}

	@Test
	public void testAddSubscriber() {
		assertTrue(distributor.addSubscriber(subscriberMelih));
		assertFalse(distributor.addSubscriber(subscriberMelih));
	}

	@Test
	public void testSearchSubscriber() {
		distributor.addSubscriber(subscriberMelih);
		assertEquals(subscriberMelih, distributor.searchSubscriber("Melih Yelman"));
		assertEquals(null, distributor.searchSubscriber("Jane Doe"));
	}

	@Test
	public void testAddSubscription() {
		distributor.addJournal(sampleJournal);
		distributor.addSubscriber(subscriberMelih);
		assertTrue(distributor.addSubscription("123456789", subscriberMelih, subscription));
		assertTrue(distributor.addSubscription("123456789", subscriberMelih, subscription)); 
		assertFalse(distributor.addSubscription("987654321", subscriberMelih, subscription)); 
	}

	@Test
	public void testListSubscriptionsWithIssn() {
		distributor.addJournal(sampleJournal);
		distributor.addSubscriber(subscriberMelih);
		distributor.addSubscription("123456789", subscriberMelih, subscription);
		ArrayList<Subscription> subscriptions = distributor.listSubscriptionsWithIssn("123456789");
		assertEquals(subscription, subscriptions.get(0));
	}

	@Test
	public void testListSubscriptions() {
		distributor.addSubscriber(subscriberMelih);
		distributor.addJournal(sampleJournal);
		distributor.addSubscription("123456789", subscriberMelih, subscription);
		ArrayList<Subscription> subscriptions = distributor.listSubscriptions("Melih Yelman");
		assertEquals(subscription, subscriptions.get(0));
	}

	@Test
	public void testListIncompletePayments() {
		distributor.addJournal(sampleJournal);
		distributor.addSubscriber(subscriberMelih);
		subscription.acceptPayment(15.0);
		distributor.addSubscription("123456789", subscriberMelih, subscription);
		ArrayList<Subscription> incompletePayments = distributor.listIncompletePayments();
		assertEquals(subscription, incompletePayments.get(0));
	}

	@Test
	public void testListAllSendingOrders() {
		distributor.addJournal(sampleJournal);
		distributor.addSubscriber(subscriberMelih);
		PaymentInfo payment = new PaymentInfo(40.0, 0);
		subscription.setPayment(payment);
		distributor.addSubscription("123456789", subscriberMelih, subscription);
		ArrayList<Subscription> sendingOrders = distributor.listAllSendingOrders(2024, 1);
		assertEquals(subscription, sendingOrders.get(0));
	}

	@Test
	public void testListSendingOrders() {
		distributor.addJournal(sampleJournal);
		distributor.addSubscriber(subscriberMelih);
		PaymentInfo payment = new PaymentInfo(40.0, 0);
		subscription.setPayment(payment);
		distributor.addSubscription("123456789", subscriberMelih, subscription);
		ArrayList<Subscription> sendingOrders = distributor.listSendingOrders("123456789", 2024, 1);
		assertEquals(subscription, sendingOrders.get(0));
	}
}
