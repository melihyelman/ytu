package uyg2_2;

public class Kitaplik {
	private Raf[] raf;
	public Kitaplik(int rafSayisi) {
		this.raf = new Raf[rafSayisi];
		for(int i =0; i < raf.length; i++) {
			raf[i] = new Raf();
		}
		
	}
	public void kitapEkle(Kitap kitap, int rafNo) {
		raf[rafNo].kitapEkle(kitap);
	}
	public void kitapSil(int rafNo,int siraNo) {
		raf[rafNo].kitapSil(siraNo);
		
	}
	public void kitapSil(int rafNo, Kitap kitap) {
		raf[rafNo].kitapSil(kitap);
	}
	public int kitapAra(String kitapAdi) {
		for(int i =0; i < raf.length; i++) {
			for(Kitap kitap: raf[i].getKitaplar()) {
				if(kitap != null && kitap.getAd().equals(kitapAdi)) {
					return 1;
				}
			}
		}
		return -1;
	}
	public void gosterRaf(int rafNo) {
		raf[rafNo].rafGoster();
		
	}
	public void tumRaflariGoster() {
		for(int i=0; i < raf.length; i++) {
			raf[i].rafGoster();
		}
	}
	public boolean kitapSat(Kitap kitap, Kart kart) {
		return true;
	}
	
}
