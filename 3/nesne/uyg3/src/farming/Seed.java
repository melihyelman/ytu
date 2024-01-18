package farming;

import java.util.Random;

public class Seed implements Plant{
	private double productionAmount, financialValue, maintenanceCost;
	
	public Seed(double productionAmount, double financialValue, double maintenanceCost) {
		this.productionAmount = productionAmount;
		this.financialValue = financialValue;
		this.maintenanceCost = maintenanceCost;
	}
	double random = new Random().nextDouble();
	
	@Override
	public void harvest() throws UnsuccessfulHarvestException {
		if(random < 0.25) {
			throw new UnsuccessfulHarvestException("Harvest unsuccessful for seed");
		}
		System.out.println("Harvest successful for seed.");
	}
	
	@Override 
	public double seedProfit() throws UnsuccessfulHarvestException {
		if(random < 0.25) {
			return -maintenanceCost;
		}
		return (productionAmount * financialValue) - maintenanceCost;
	}
	
	public double getMaintanceCost() {
		return maintenanceCost;
	}
	
	@Override
    public String toString() {
        return "Seed [productionAmount=" + productionAmount + ", financialValue=" + financialValue +
                ", maintenanceCost=" + maintenanceCost + "]";
    }
	
	public void performHarvest() {
		System.out.println("Harvesting seed.");
		try {
			harvest();
		}catch (UnsuccessfulHarvestException e){
			System.out.println("Exception : " + e.getMessage());
		}
	}
}
