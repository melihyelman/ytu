package melihyelman;

public class Staff {
	private String name;
	private double salary;
	
	public Staff(String name, double salary) {
		this.name = name;
		this.salary = salary;
	}
	public void increaseSalary(double percantage) {
		this.salary += this.salary * percantage / 100;
	}
	public double getSalary() {
		return salary;
	}
	public void setSalary(double salary) {
		this.salary = salary;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String toString() {
		return "Staff,"+this.getName() + "," + this.getSalary();
	}
}
