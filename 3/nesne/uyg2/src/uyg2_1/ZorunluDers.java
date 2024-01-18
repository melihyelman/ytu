package uyg2_1;

/**
 * 
 */
public class ZorunluDers extends Ders{
	private int vize2;
	
	public ZorunluDers(String dersAdi, int vize1, int vize2,int finalNot) {
		super(dersAdi, vize1, finalNot);
		this.vize2=vize2;
	}

	@Override
	public double hesaplaNot() {
		System.out.println("zorunlu ders");
		return vize1*0.3+vize2*0.3+finalNot*0.4;
	}
	
	

}
