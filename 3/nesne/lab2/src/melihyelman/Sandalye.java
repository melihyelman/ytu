package melihyelman;

public class Sandalye {
	private int no;
	private boolean doluluk;
	private final int ucret;
	public Sandalye(int no) {
		this.no = no;
		this.ucret = 15;
	}
	public boolean isDoluluk() {
		return doluluk;
	}
	public void setDoluluk(boolean doluluk) {
		this.doluluk = doluluk;
	}
	public int getNo() {
		return no;
	}
	public int getUcret() {
		return ucret;
	}
	@Override
	public String toString() {
		return "Sandalye [no=" + no + ", doluluk=" + doluluk + "]";
	}
	
}
