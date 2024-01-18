package test2;

public class BeklemeSalonu {
	private int koltukSayisi,bekleyenSayisi;
	 
	public BeklemeSalonu(int koltukSayisi) {
		if(koltukSayisi > 2) this.koltukSayisi = koltukSayisi;
		else this.koltukSayisi = koltukSayisi;
		bekleyenSayisi = 0;
	};
	public int getBekleyenSayisi() {
		return this.bekleyenSayisi;
	}
	public boolean müsteriBeklet() {
		if(koltukSayisi == bekleyenSayisi) return false;
		return true;
	}
	public boolean müsteriCek() {
		if(bekleyenSayisi > 0) {
			bekleyenSayisi--;
			return true;
		}
		return false;
	}
}
