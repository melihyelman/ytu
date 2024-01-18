package melihyelman;
import java.util.LinkedList;

public class Patient implements IMedicalPersonnel{
	private String name;
	private LinkedList<Treatment> treatments;
	
	public Patient(String name) {
		this.name = name;
		treatments = new LinkedList<Treatment>();
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return this.name;
	}
	public LinkedList<Treatment> getTreatments() {
		return treatments;
	}

	@Override
	public String toString() {
		return "Patient: " + name;
	}
}
