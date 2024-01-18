package uyg2_2;

public class KitaplikYonetim {
	private Kitaplik kitaplik;
	
	public boolean kitapSat(Kitap kitap,Kart kart) {
		int rafNo = kitaplik.kitapAra(kitap.getAd());
		
		if(rafNo == -1) {
			System.out.println("Kitap Yok.");
			return false;
		}else if (kart.odemeYap(kitap.getFiyat())) {
			System.out.println("Kitap satıldı.");
			kitaplik.kitapSil(rafNo,kitap);
			return true;
		}else {
			System.out.println("bakiye Yok.");
			return false;
		}
	}
	public KitaplikYonetim(Kitaplik kitaplik) {
		this.kitaplik = kitaplik;
	}

}
