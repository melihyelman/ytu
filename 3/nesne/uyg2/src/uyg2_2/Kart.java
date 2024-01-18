package uyg2_2;

public abstract class Kart {
	
	private int id;
	private String Sahip;
	private double Bakiye;
	
	public Kart(int id, String sahip, double bakiye) {
		this.id = id;
		Sahip = sahip;
		Bakiye = bakiye;
	}
	public double getBakiye() {
		return Bakiye;
	}
	public void setBakiye(double bakiye) {
		Bakiye = bakiye;
	}
	public int getId() {
		return id;
	}
	public String getSahip() {
		return Sahip;
	}
	
	public abstract boolean odemeYap(double fiyat);
	
	@Override
	public String toString() {
		return "Kart [id=" + id + ", Sahip=" + Sahip + ", Bakiye=" + Bakiye + "]";
	}
	
	
	
	
}
