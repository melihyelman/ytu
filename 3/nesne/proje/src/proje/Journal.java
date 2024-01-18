package proje;

import java.io.Serializable;
import java.util.ArrayList;

public class Journal implements Serializable {
	private static final long serialVersionUID = 1L;
	private String name;
	private String issn;
	private int frequency;
	private double issuePrice;
	private ArrayList<Subscription> subscriptions;
	
	public Journal(String name, String issn, int frequency, double issuePrice) {
		this.name = name;
		this.issn = issn;
		this.frequency = frequency == 0 ? 1 : frequency;
		this.issuePrice = issuePrice;
		this.subscriptions = new ArrayList<>();
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIssn() {
		return issn;
	}

	@Override
	public String toString() {
		return "Name: " + name + ", Issn: " + issn + ", Frequency: " + frequency + ", Issue Price: " + issuePrice;
	}

	public ArrayList<Subscription> getSubscriptions() {
		return subscriptions;
	}

	public void setIssn(String issn) {
		this.issn = issn;
	}

	public int getFrequency() {
		return frequency;
	}

	public void setFrequency(int frequency) {
		this.frequency = frequency;
	}

	public double getIssuePrice() {
		return issuePrice;
	}

	public void setIssuePrice(double issuePrice) {
		this.issuePrice = issuePrice;
	}

	public void addSubscription(Subscription subscription) {
		subscriptions.add(subscription);
	}

}
