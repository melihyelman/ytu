package melihyelman;

public class MarketCard {
	private int cardNo;
	private double points;
	
	public MarketCard(int cardNo) {
		this.cardNo=cardNo;
	}
	public void addPoints(double point) {
		this.points += point;
	}
	public double getPoints() {
		return this.points;
	}
}
