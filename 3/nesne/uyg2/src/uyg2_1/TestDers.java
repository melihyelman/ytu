package uyg2_1;

public class TestDers {

	public static void main(String[] args) {
		Ders ders1 = new Ders("İş sağlığı",75,95);
		System.out.println(ders1.hesaplaNot());
		
		ZorunluDers zorunluDers1 = new ZorunluDers("BBG",95,70,80);
		System.out.println(zorunluDers1.hesaplaNot());
		
		SecmeliDers secmeliDers1 = new SecmeliDers("Mat",95,70,60,80);
		System.out.println(secmeliDers1.hesaplaNot());
	}

}
