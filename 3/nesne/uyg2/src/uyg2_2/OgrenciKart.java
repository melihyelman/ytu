package uyg2_2;

public class OgrenciKart extends Kart {
	private double bonus;

	public OgrenciKart(int id, String sahip, double bakiye) {
		super(id, sahip, bakiye);
		this.bonus = 0;
	}

	@Override
	public boolean odemeYap(double fiyat) {
		if(this.getBakiye() >= fiyat) {
			this.setBakiye(getBakiye()-fiyat);
			bonus += fiyat *0.2;
			return true;
		}else if (this.getBonus() >= fiyat) {
			this.setBonus(this.getBonus()-fiyat);
			return true;
		}
		return false;
	}

	public double getBonus() {
		return bonus;
	}

	public void setBonus(double bonus) {
		this.bonus = bonus;
	}


}
