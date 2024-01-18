package proje;

import java.io.Serializable;

public class PaymentInfo implements Serializable {
	private static final long serialVersionUID = 1L;
	private final double discountRatio;
	private double receivedPayment;

	public PaymentInfo(double receivedPayment, double discountRatio) {
		if (discountRatio > 1) {
			discountRatio = 1;
		} else if (discountRatio < 0) {
			discountRatio = 0;
		}
		this.receivedPayment = receivedPayment > 0 ? receivedPayment : 0;
		this.discountRatio = discountRatio;
	}

	public void increasePayment(double amount) {
		this.receivedPayment += amount;
	}

	public double getReceivedPayment() {
		return this.receivedPayment;
	}

	public double getDiscountRatio() {
		return discountRatio;
	}

}
