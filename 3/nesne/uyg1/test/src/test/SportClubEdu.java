package test;

import java.util.Scanner;

public class SportClubEdu {

	public static void main(String[] args) {
		Sport sp1 = new Sport();
		sp1.setName("tenis");
		System.out.println(sp1.getName());
		
		Scanner input = new Scanner(System.in);
		System.out.println("enter sport name:");

		String sp_name = input.nextLine();
		Sport sp2 = new Sport();
		sp2.setName(sp_name);
		System.out.println(sp2.getName());
		
		Sport sp3 = new Sport("Basketball", 10,25.90);
	}

}
