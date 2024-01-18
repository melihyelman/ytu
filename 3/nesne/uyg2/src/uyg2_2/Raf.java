package uyg2_2;

public class Raf {
	private Kitap[] kitaplar;
	
	public Raf() {
		this.kitaplar = new Kitap[10];
		
	}
	public void kitapEkle(Kitap kitap) {
		int i=0;
		while(kitaplar[i] != null &&i < kitaplar.length)
			i++;
		if(i != kitaplar.length)
			kitaplar[i] = kitap;
		
	}
	public void kitapSil(int siraNo) {
		if(siraNo < kitaplar.length) 
				kitaplar[siraNo] = null;
		
	}
	public void kitapSil(Kitap kitap) {
		int i =0;
		while(kitaplar[i] != kitap && i < kitaplar.length) i++;
		if(i != kitaplar.length) kitaplar[i] = null;
		
	}
	public void rafGoster() {
		int i =0;
		for(i = 0; i < kitaplar.length; i++) System.out.println(kitaplar[i]);
	}
	public Kitap[] getKitaplar() {
		return this.kitaplar;
		
	}
}
