package uyg2_1;

public class Ders {
	protected String dersAdi;
	protected int vize1;
	protected int finalNot;
	
	public Ders(String dersAdi, int vize1, int finalNot) {
		this.dersAdi = dersAdi;
		this.vize1 = vize1;
		this.finalNot = finalNot;
	}
	public double hesaplaNot() {
		System.out.println("ders sınıfından cagrilan not hesapla");
		return vize1*0.4+finalNot*0.6;
	}
}
