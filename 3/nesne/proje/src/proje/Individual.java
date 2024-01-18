package proje;

public class Individual extends Subscriber {
	private static final long serialVersionUID = 1L;
	private String creditCardNr;
	private int expireMonth;
	private int expireYear;
	private int CCV;

	public Individual(String name, String address, String creditCardNr, int expireMonth, int expireYear, int cCV) {
		super(name, address);
		this.creditCardNr = creditCardNr;
		this.expireMonth = expireMonth;
		this.expireYear = expireYear;
		CCV = cCV;
	}

	@Override
	public String toString() {
		return "Individual " + "\nName: " + super.getName() + ", Address: " + super.getAddress()
				+ "\nCredit Card Number: " + creditCardNr + ", Expire Month: " + expireMonth + ", Expire Year: "
				+ expireYear + ", CCV: " + CCV;
	}

	@Override
	public String getBillingInformation() {
		return "Credit Card Number: " + creditCardNr + ", Expire Month: " + expireMonth + ", Expire Year: " + expireYear
				+ ", CCV: " + CCV;
	}

	public String getCreditCardNr() {
		return creditCardNr;
	}

	public int getExpireMonth() {
		return expireMonth;
	}

	public int getExpireYear() {
		return expireYear;
	}

	public int getCCV() {
		return CCV;
	}

}
