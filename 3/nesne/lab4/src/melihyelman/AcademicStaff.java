package melihyelman;

public class AcademicStaff extends Staff{
	private int numberOfCourses;
	
	public AcademicStaff(String name, double salary, int numberOfCourses) {
		super(name, salary);
		this.numberOfCourses = numberOfCourses;
	}
	
	public void increaseSalary(double percantage) {
		double newSalary = super.getSalary() + (super.getSalary() * percantage / 100 )+ ( numberOfCourses * 1000);
		super.setSalary(newSalary);
	}

	@Override
	public String toString() {
		return "Academic," + super.getName() + "," + super.getSalary() + "," + this.numberOfCourses;
	}
	
}
