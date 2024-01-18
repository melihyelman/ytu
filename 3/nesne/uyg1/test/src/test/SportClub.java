package test;

public class SportClub {

	public static void main(String[] args) {
		Sport s1 = new Sport("tennis",10, 25.90);
		Sport s2 = new Sport("football",15, 55.90);
		Sport s3 = new Sport("basketball",20, 45.90);
		
		Member m1 = new Member("John Doe", 100);
		m1.getInfo();
		
		Member m2 = new Member("John Doe 2", 200);
		m2.getInfo();
		
		m1.registerCourse(s1);
		m1.registerCourse(s2);
		m1.registerCourse(s3);
		m1.listCourses();
		
		System.out.println(m1);
		
		System.out.println(ClubCard.getCounter());
	}

}
