package melihyelman;

public class NormalKisi extends Kisi{

	public NormalKisi(String ad, int id, double bakiye) {
		super(ad, id, bakiye);
		// TODO Auto-generated constructor stub
	}

	@Override
	public boolean odemeYap(double fiyat) {
		if(this.getBakiye() >= fiyat) {
			this.setBakiye(this.getBakiye()-fiyat);
			System.out.println("Bakiyenizden düşüm gerçekleşti");
			return true;
		}else {
			System.out.println("Bakiye yetersiz");
			return false;
		}
	}
	
}
