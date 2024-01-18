package melihyelman;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Hospital {
	private ArrayList<Doctor> medicalPersonnelList;
	
	public Hospital() {
		medicalPersonnelList = new ArrayList<>();
	}
	
	public void addMedicalPersonnel(Doctor personnel) {
		medicalPersonnelList.add(personnel);
	}
	Random random = new Random();
	public void assignPatientToDoctor(Doctor doctor, Patient patient, Treatment treatment) {
		try {
			doctor.performSurgery();
			System.out.println(doctor.getName() + " performed successfull surgery on Patient: " + patient.getName());
			System.out.println("Prescribed Treatment: " + treatment.toString());
			
			int durationOfStay = random.nextInt(10) + 1;
			int dailyFee = 100;
			int totalFee = dailyFee * durationOfStay;
			Room room = new Room(durationOfStay);
			room.addTreatment(treatment);
			System.out.println("Allocated " + room.toString());
			System.out.println("Daily Fee For Patient: " + patient.getName() + " " + dailyFee);
			System.out.println("Total Fee For Patient: " + patient.getName() + " " + totalFee);
			System.out.println("*****Treatment End******");
		}catch (SurgeryUnsuccessfulException e) {
				System.out.println(e.getMessage());
				System.out.println("Patient: " + patient.getName() + " did not survive the surgery");
				System.out.println("Total Fee for Patient: " + patient.getName() + " " + treatment.getSurgeryCost());
				System.out.println("*****Treatment Fail******");
			
			
		}
	}
	public static <Z> void showList(List<Z> doctors) {
		for(Z z : doctors) {
			System.out.println(z);
		}
	}
}
