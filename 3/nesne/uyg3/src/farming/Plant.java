package farming;

public interface Plant {
	public double seedProfit() throws UnsuccessfulHarvestException;
	public void harvest() throws UnsuccessfulHarvestException;
}
