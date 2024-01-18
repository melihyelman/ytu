package proje;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

public class JournalTest {

	private Journal journal;

	@Before
	public void setUp() {
		journal = new Journal("Melih Yelman", "123456789", 2, 20.0);
	}

	@Test
	public void testGettersAndSetters() {
		assertEquals("Melih Yelman", journal.getName());
		assertEquals("123456789", journal.getIssn());
		assertEquals(2, journal.getFrequency());
		assertEquals(20.0, journal.getIssuePrice(), 0.001);

		journal.setName("New Melih Yelman");
		assertEquals("New Melih Yelman", journal.getName());

		journal.setIssn("987654321");
		assertEquals("987654321", journal.getIssn());

		journal.setFrequency(3);
		assertEquals(3, journal.getFrequency());

		journal.setIssuePrice(25.0);
		assertEquals(25.0, journal.getIssuePrice(), 0.001);
	}

	@Test
	public void testAddSubscription() {
		DateInfo dates = new DateInfo(1, 2024);
		Individual subscriber = new Individual("Melih", "Kadikou", "1234432112344321", 1, 2024, 976);
		Subscription subscription = new Subscription(dates, 1, journal, subscriber);
		journal.addSubscription(subscription);

		ArrayList<Subscription> subscriptions = journal.getSubscriptions();
		assertNotNull(subscriptions);
		assertEquals(1, subscriptions.size());
		assertEquals(subscription, subscriptions.get(0));
	}

	@Test
	public void testToString() {
		String expectedToString = "Name: Melih Yelman, Issn: 123456789, Frequency: 2, Issue Price: 20.0";
		assertEquals(expectedToString, journal.toString());
	}
}
