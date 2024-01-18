package melihyelman;

import java.util.List;

public class SalaryIncreaseThread implements Runnable {
	private List<Staff> StaffList;
	private double increasePercentage;
	
	public SalaryIncreaseThread(List<Staff> StaffList, double percentage) {
		this.StaffList = StaffList;
		this.increasePercentage = percentage;
	}

	@Override
	public void run() {
		for(Staff staff : StaffList) {
			staff.increaseSalary(increasePercentage);
		}
	}

}
