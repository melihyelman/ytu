package uyg2_2;

public class YetiskinKart extends Kart{

	public YetiskinKart(int id, String sahip, double bakiye) {
		super(id, sahip, bakiye);
		// TODO Auto-generated constructor stub
	}

	@Override
	public boolean odemeYap(double fiyat) {
		if(this.getBakiye() >= fiyat) {
			this.setBakiye(this.getBakiye() - fiyat);
			return true;
		}
		return false;
	}
	
}
