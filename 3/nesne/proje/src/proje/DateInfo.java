package proje;

import java.io.Serializable;

public class DateInfo implements Serializable {
	private static final long serialVersionUID = 1L;
	private int startMonth;
	private int endMonth;
	private int startYear;
	
	public DateInfo(int startMonth, int startYear) {
		this.startMonth = startMonth;
		this.endMonth = startMonth - 1 > 0 ? startMonth-1 : 12;
		this.startYear = startYear;
	}

	public int getStartMonth() {
		return startMonth;
	}

	public int getEndMonth() {
		return endMonth;
	}

	public int getStartYear() {
		return startYear;
	}
	
	
}
