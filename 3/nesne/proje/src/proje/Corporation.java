package proje;

public class Corporation extends Subscriber {
	private static final long serialVersionUID = 1L;
	private int bankCode;
	private int issueDay;
	private int issueMonth;
	private int issueYear;
	private int accountNumber;
	private String bankName;

	public Corporation(String name, String address, int bankCode, int issueDay, int issueMonth, int issueYear,
			int accountNumber, String bankName) {
		super(name, address);
		this.bankCode = bankCode;
		this.issueDay = issueDay;
		this.issueMonth = issueMonth;
		this.issueYear = issueYear;
		this.accountNumber = accountNumber;
		this.bankName = bankName;
	}

	public int getBankCode() {
		return bankCode;
	}

	public int getIssueDay() {
		return issueDay;
	}

	public int getIssueMonth() {
		return issueMonth;
	}

	public int getIssueYear() {
		return issueYear;
	}

	public int getAccountNumber() {
		return accountNumber;
	}

	public String getBankName() {
		return bankName;
	}

	@Override
	public String getBillingInformation() {
		return "Bank Code: " + bankCode + ", Bank Name: " + bankName + ", Account Number: " + accountNumber
				+ ", Issue Day: " + issueDay + ", Issue Month: " + issueMonth + ", Issue Year: " + issueYear;
	}

	@Override
	public String toString() {
		return "Corporation \nName: " + super.getName() + ", Address: " + super.getAddress() + "\nBank Code: "
				+ bankCode + ", Bank Name: " + bankName + ", Account Number: " + accountNumber + "\nIssue Day: "
				+ issueDay + ", Issue Month: " + issueMonth + ", Issue Year: " + issueYear;
	}

}
