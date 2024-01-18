package melihyelman;

public class Abonman extends Kisi{

	private int kredi;
		
	public Abonman(String ad, int id, double bakiye,int kredi) {
		super(ad, id, bakiye);
		this.kredi = kredi;
	}

	public int getKredi() {
		return kredi;
	}

	public void setKredi(int kredi) {
		this.kredi = kredi;
	}

	@Override
	public boolean odemeYap(double fiyat) {
		if(kredi >= 5 ) {
			System.out.println("Bakiyenizden düşüm gerçekleşti");
			this.kredi -= 5;
			return true;
		}else if (this.getBakiye() >= fiyat) {
			this.setBakiye(this.getBakiye()-fiyat);
			this.kredi +=1;
			System.out.println("Bakiyenizden düşüm gerçekleşti");
			return true;
		}else {
			System.out.println("Bakiye yetersiz.");
			return false;
		}
	}

	@Override
	public String toString() {
		return  super.toString() + " Abonman [kredi=" + kredi + "]" ;
	}
	

}
