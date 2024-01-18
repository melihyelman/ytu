package uyg2_1;

public class SecmeliDers extends Ders {
	private int vize2;
	private int projeNot;

	public SecmeliDers(String dersAdi, int vize1, int vize2,int projeNot, int finalNot) {
		super(dersAdi, vize1, finalNot);
		this.vize2=vize2;
		this.projeNot=projeNot;
	}

	@Override
	public double hesaplaNot() {
		System.out.println("secmeli ders");
		return vize1*0.2+vize2*0.2+projeNot*0.2+finalNot*0.4;
	}
	
}
