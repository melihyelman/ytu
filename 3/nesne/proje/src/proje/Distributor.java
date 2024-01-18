package proje;

import java.util.Hashtable;
import java.util.Vector;
import java.util.Map.Entry;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;

public class Distributor implements Runnable {
	private Hashtable<String, Journal> journals;
	private Vector<Subscriber> subscribers;

	public Distributor() {
		this.journals = new Hashtable<>();
		this.subscribers = new Vector<>();
	}

	public Hashtable<String, Journal> getJournals() {
		return journals;
	}

	public Vector<Subscriber> getSubscribers() {
		return subscribers;
	}

	public boolean addJournal(Journal journal) {
		if (searchJournal(journal.getIssn()) == null) {
			journals.put(journal.getIssn(), journal);
			return true;
		}
		return false;
	}

	public Journal searchJournal(String issn) {
		return journals.get(issn);
	}

	public boolean addSubscriber(Subscriber subscriber) {
		if (searchSubscriber(subscriber.getName()) == null) {
			subscribers.add(subscriber);
			return true;
		}
		return false;
	}

	public Subscriber searchSubscriber(String name) {
		for (Subscriber sub : subscribers) {
			if (sub.getName().equals(name)) {
				return sub;
			}
		}
		return null;
	}

	public boolean addSubscription(String issn, Subscriber subscriber, Subscription subscription) {
		Journal journal = searchJournal(issn);
		if (journal != null) {
			ArrayList<Subscription> subscriptions = journal.getSubscriptions();
			for (Subscription subscriptionElement : subscriptions) {
				if (subscriptionElement.getSubscriber().getName() == subscriber.getName()) {
					subscriptionElement.increaseCopies();
					return true;
				}
			}
			journal.addSubscription(subscription);
			return true;
		}
		return false;
	}

	public ArrayList<Subscription> listSubscriptionsWithIssn(String issn) {
		if (searchJournal(issn) == null)
			return null;

		Journal journal = searchJournal(issn);

		return journal.getSubscriptions();
	}

	public ArrayList<Subscription> listSubscriptions(String subscriberName) {
		if (searchSubscriber(subscriberName) == null)
			return null;

		ArrayList<Subscription> subscriptions = new ArrayList<>();
		for (Entry<String, Journal> entry : journals.entrySet()) {
			ArrayList<Subscription> journalsSubscriptions = entry.getValue().getSubscriptions();
			for (Subscription subscription : journalsSubscriptions) {
				if (subscription.getSubscriber().getName().equals(subscriberName)) {
					subscriptions.add(subscription);
				}
			}
		}
		return subscriptions;
	}

	public ArrayList<Subscription> listIncompletePayments() {
		ArrayList<Subscription> incompletePayments = new ArrayList<>();
		for (Entry<String, Journal> entry : journals.entrySet()) {
			ArrayList<Subscription> journalsSubscriptions = entry.getValue().getSubscriptions();
			for (Subscription subscription : journalsSubscriptions) {
				if (subscription.getPayment() != null) {
					double totalAmount = subscription.getCopies() * (subscription.getJournal().getIssuePrice()
							* (1 - subscription.getPayment().getDiscountRatio()));
					if (subscription.getPayment().getReceivedPayment() < totalAmount) {
						incompletePayments.add(subscription);
					}
				} else {
					incompletePayments.add(subscription);
				}
			}
		}
		return incompletePayments;
	}

	public ArrayList<Subscription> listAllSendingOrders(int year, int month) {
		ArrayList<Subscription> sendingOrders = new ArrayList<>();
		for (Entry<String, Journal> entry : journals.entrySet()) {
			ArrayList<Subscription> journalsSubscriptions = entry.getValue().getSubscriptions();
			for (Subscription subscription : journalsSubscriptions) {
				DateInfo dates = subscription.getDates();
				Journal journal = entry.getValue();
				if ((year == dates.getStartYear() && month >= dates.getStartMonth())
						|| (year == dates.getStartYear() + 1 && month <= dates.getEndMonth())) {
					int yearDifference = year - dates.getStartYear() == 0 ? 0 : 12;
					double frequency = 12 / (double) journal.getFrequency();
					int issueMonth = (int) ((month + yearDifference - dates.getStartMonth()) / (frequency));
					boolean isIssueMonth = Math.floor(
							(dates.getStartMonth() + (issueMonth * (frequency)))) == (yearDifference == 12 ? month + 12
									: month) ? true : false;

					if (isIssueMonth && subscription.canSend(issueMonth + 1)) {
						sendingOrders.add(subscription);
					}
				}
			}
		}
		return sendingOrders;
	}

	public ArrayList<Subscription> listSendingOrders(String issn, int year, int month) {
		Journal journal = searchJournal(issn);
		ArrayList<Subscription> sendingOrders = new ArrayList<>();
		ArrayList<Subscription> journalsSubscriptions = journal.getSubscriptions();
		for (Subscription subscription : journalsSubscriptions) {
			DateInfo dates = subscription.getDates();
			if ((year == dates.getStartYear() && month >= dates.getStartMonth())
					|| (year == dates.getStartYear() + 1 && month <= dates.getEndMonth())) {
				int yearDifference = year - dates.getStartYear() == 0 ? 0 : 12;
				double frequency = 12 / (double) journal.getFrequency();
				int issueMonth = (int) ((month + yearDifference - dates.getStartMonth()) / (frequency));
				boolean isIssueMonth = Math.floor(
						(dates.getStartMonth() + (issueMonth * (frequency)))) == (yearDifference == 12 ? month + 12
								: month) ? true : false;

				if (isIssueMonth && subscription.canSend(issueMonth + 1)) {
					sendingOrders.add(subscription);
				}
			}
		}
		return sendingOrders;
	}

	public synchronized boolean saveState(String fileName) {
		System.out.println("a");
		try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(fileName))) {
			oos.writeObject(journals);
			oos.writeObject(subscribers);
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}

	}

	@SuppressWarnings("unchecked")
	public synchronized boolean loadState(String fileName) {
		try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(fileName))) {
			journals = (Hashtable<String, Journal>) ois.readObject();
			subscribers = (Vector<Subscriber>) ois.readObject();
			return true;
		} catch (IOException | ClassNotFoundException e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean report(int month, int year, int startYear, int endYear) {
		try (BufferedWriter writer = new BufferedWriter(new FileWriter("report.html"))) {
			ArrayList<Subscription> expiringSubscriptions = new ArrayList<>();
			double totalPayments = 0;
			double receivedTotalPayments = 0;

			for (Entry<String, Journal> entry : journals.entrySet()) {
				ArrayList<Subscription> journalSubscriptions = entry.getValue().getSubscriptions();

				for (Subscription subscription : journalSubscriptions) {
					DateInfo dates = subscription.getDates();

					if ((year > dates.getStartYear() + 1)
							|| (year == dates.getStartYear() + 1 && month > dates.getEndMonth())
							|| (year == dates.getStartYear() && month < dates.getEndMonth())) {
						expiringSubscriptions.add(subscription);
					}
					if (dates.getStartYear() >= startYear && endYear >= dates.getStartYear() + 1) {
						if (subscription.getPayment() != null) {
							totalPayments += subscription.getCopies() * (subscription.getJournal().getIssuePrice()
									* subscription.getJournal().getFrequency()
									* (1 - subscription.getPayment().getDiscountRatio()));
							receivedTotalPayments += subscription.getPayment().getReceivedPayment();
						} else {
							totalPayments += subscription.getCopies() * (subscription.getJournal().getIssuePrice()
									* subscription.getJournal().getFrequency());
						}
					}
				}
			}
			writer.write("<html><head><title>Report</title></head><body>");

			writer.write("<p>You will earn this much money between the given dates: " + totalPayments + "</p>");
			writer.write("<p>You have already received this much money between the given dates " + receivedTotalPayments + "</p>");

			writer.write("Expiring Subscriptions between the given dates: <ul>");
			
			for(Subscription sub : expiringSubscriptions) {
				writer.write("<li> " + sub.toString() + "</li>");
			}

			writer.write("</ul></body></html>");
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public void run(int month, int year, int startYear, int endYear) {
		report(month, year, startYear, endYear);

	}

	@Override
	public void run() {
		// TODO Auto-generated method stub

	}

}
