package melihyelman;

public class KitapKafe {
	private Masa[] masalar;
	
	public KitapKafe(int adet) {
		if(adet <= 2 && adet >= 0) {
			masalar = new Masa[adet];
		}else {
			System.out.println("0-2 arası adet girilebilir");
		}
	}
	
	public boolean yerAyir(Kisi kisi) {
		for(int i =0; i < masalar.length;i++) {
			for(int j = 0; j < masalar[i].getSandalyeler().length; j++) {
				Sandalye[] sandalyeler = masalar[i].getSandalyeler();
				if(sandalyeler[j] != null && !sandalyeler[j].isDoluluk()) {
					if(kisi.odemeYap(sandalyeler[j].getUcret())) {
						sandalyeler[j].setDoluluk(true);
						System.out.println(i + ". masa " + j + ". sandalyeye atandınız");	
					}
					
					return true;
				}
			}
		}
		System.out.println("bos masa yok");
		return false;
	}
	public void tumMasalariGoster() {
		for(int i =0;i < masalar.length; i++) {
			System.out.println(i + ". masa");
			Sandalye[] sandalyeler = masalar[i].getSandalyeler();
			for(int j = 0; j < sandalyeler.length; j++) {
				if(sandalyeler[j] == null) {
					System.out.println("null");
				}else {
					System.out.println(sandalyeler[j].toString());
				}
			}
		}
	}
	public void masaEkle(Masa masa) {
		int i =0;
		while(i < masalar.length && masalar[i] != null) i++;
		if(i != masalar.length) masalar[i] = masa;
	}
}
