package test2;

public class BerberDükkanı {
	private final int koltukSayisi;
	private int berberSayisi;
	private int doluKoltukSayisi;
	private BeklemeSalonu bekleme;
	
	public BerberDükkanı(int berberSayisi, int koltukSayisi) {
		if(berberSayisi < 1) this.berberSayisi = 1; else this.berberSayisi = berberSayisi;
		if(koltukSayisi < 1) this.koltukSayisi = 1; else this.koltukSayisi = koltukSayisi;
		if(berberSayisi > koltukSayisi) this.berberSayisi = koltukSayisi;
		doluKoltukSayisi = 0;
		BeklemeSalonu bekleme = new BeklemeSalonu(this.koltukSayisi);
	}
	public boolean berberEkle() {
		if(berberSayisi < koltukSayisi) {
			 this.berberSayisi++;
			 return true;
		}
		return false;
	}
	public boolean müsteriGeldi() {
		if(doluKoltukSayisi < berberSayisi) {
			doluKoltukSayisi++;
			return true;
		}else {
			bekleme.müsteriBeklet();
		}
		return false;
	}
	public boolean müsteriTrasOldu() {
		if(bekleme.müsteriCek()) {
			this.doluKoltukSayisi++;
			return true;
		}
		this.doluKoltukSayisi--;
		return false;
	}
}
