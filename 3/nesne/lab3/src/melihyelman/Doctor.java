package melihyelman;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Doctor implements ISurgeon, IMedicalPersonnel{
	private static ArrayList<Doctor> doctorList =   new ArrayList<>();
	private String name;
	private double experience;
	private int surgeries;
	
	public Doctor(String name) {
		this.name = name;
		surgeries = 0;
		experience = 0;
		doctorList.add(this);
	}

	@Override
	public void performSurgery() throws SurgeryUnsuccessfulException {
		if(surgeries == 1 && experience == 0) {
			throw new SurgeryUnsuccessfulException(this.name +  " has already completed 1 unsucessfull surgery ");
		}
		surgeries++;
		double random = new Random().nextDouble();
		if(random < 0.8) {
			throw new SurgeryUnsuccessfulException("Surgery by " + this.name + " was unsuccessful.");
		}
		experience += 2.5;
		
	}
	public static List<Doctor> getDoctorList() {
		return doctorList;
	}
	public double getSurgery() {
		return surgeries;
	}

	@Override
	public String toString() {
		return "Doctor: " + name + ", Experience=" + experience + ", Surgeries=" + surgeries + "]";
	}

	@Override
	public String getName() {
		return this.name;
	}
	
}
