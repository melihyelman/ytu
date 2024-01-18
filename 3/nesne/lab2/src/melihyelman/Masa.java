package melihyelman;

public class Masa {
	private Sandalye[] sandalyeler;
	
	public Masa() {
		this.sandalyeler = new Sandalye[3];
	}
	public void sandalyeEkle(Sandalye sandalye) {
		int i=0;
		while(i < sandalyeler.length && sandalyeler[i] !=null) {
			 i++;
		}
		if(i != sandalyeler.length) {
			sandalyeler[i] = sandalye;
		}
		
	}
	public void sandalyeEkle(Sandalye sandalye, int sira) {
		if(sandalyeler[sira] == null &&sira < sandalyeler.length && sira >= 0) {
			sandalyeler[sira] = sandalye;
		}
	}
	public void sandalyeSil(Sandalye sandalye) {
		for(int i=0; i < sandalyeler.length;i++ ) {
			if(sandalyeler[i].getNo() == sandalye.getNo()) {
				sandalyeler[i] = null;
			}
		}
	}
	public void masaDolulukGoster() {
		for(int i =0; i < sandalyeler.length;i++) {
			if(sandalyeler[i] != null) {

				System.out.println(sandalyeler[i].isDoluluk());
			}
		}
	}
	public Sandalye[] getSandalyeler() {
		return sandalyeler;
	}
}
