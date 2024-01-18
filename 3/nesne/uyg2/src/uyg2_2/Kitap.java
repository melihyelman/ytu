package uyg2_2;

public class Kitap {
	private String ad;
	private String yazar;
	private  String isbn ;
	private double fiyat;
	private static int kitapSayisi;
	
	public Kitap(String ad, String yazar, String isbn) {
		this.ad = ad;
		this.yazar = yazar;
		this.isbn = isbn;
		kitapSayisi++;
		this.fiyat=10.0;
	}

	public String getAd() {
		return ad;
	}

	public void setAd(String ad) {
		this.ad = ad;
	}

	public String getYazar() {
		return yazar;
	}

	public void setYazar(String yazar) {
		this.yazar = yazar;
	}

	public String getIsbn() {
		return isbn;
	}

	public double getFiyat() {
		return fiyat;
	}

	public static int getKitapSayisi() {
		return kitapSayisi;
	}

	@Override
	public String toString() {
		return "Kitap [ad=" + ad + ", yazar=" + yazar + ", isbn=" + isbn + ", fiyat=" + fiyat + "]";
	}

}
