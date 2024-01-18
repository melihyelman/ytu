package proje;

import java.io.Serializable;

public class Subscription implements Serializable {
	private static final long serialVersionUID = 1L;
	private final DateInfo dates;
	private PaymentInfo payment;
	private int copies;
	private final Journal journal;
	private final Subscriber subscriber;

	public Subscription(DateInfo dates, int copies, Journal journal, Subscriber subscriber) {
		this.dates = dates;
		this.copies = copies > 1 ? copies : 1;
		this.journal = journal;
		this.subscriber = subscriber;
		this.payment = null;
	}

	public boolean acceptPayment(double amount) {
		if (payment == null || amount <= 0)
			return false;
		double totalAmount = copies
				* (journal.getFrequency() * journal.getIssuePrice() * (1 - payment.getDiscountRatio()));
		if (payment.getReceivedPayment() + amount <= totalAmount) {
			payment.increasePayment(amount);
			return true;
		}
		return false;
	}

	public DateInfo getDates() {
		return dates;
	}

	public boolean setPayment(PaymentInfo payment) {
		double totalAmount = copies
				* (journal.getFrequency() * journal.getIssuePrice() * (1 - payment.getDiscountRatio()));
		if (payment.getReceivedPayment() > totalAmount) {
			return false;
		}
		this.payment = payment;
		return true;
	}

	public PaymentInfo getPayment() {
		return payment;
	}

	public int getCopies() {
		return copies;
	}

	public Journal getJournal() {
		return journal;
	}

	public Subscriber getSubscriber() {
		return subscriber;
	}

	public boolean canSend(int issueMonth) {
		if (payment == null)
			return false;
		return payment
				.getReceivedPayment() >= ((journal.getIssuePrice() * (1 - payment.getDiscountRatio())) * issueMonth);
	}

	public void increaseCopies() {
		this.copies += 1;
	}

	@Override
	public String toString() {
		String str = "Start Year:" + dates.getStartYear() + ", Start Month: " + dates.getStartMonth() + ", End Month:"
				+ dates.getEndMonth() + ", Copies: " + copies + "\nJournal Name:" + journal.getName()
				+ ", Subscriber Name:" + subscriber.getName();
		if (this.payment != null) {
			str += "\nRecevied Amount: " + payment.getReceivedPayment() + ", Discount Ratio: "
					+ payment.getDiscountRatio();
		}
		return str;
	}

}
