package farming;

import java.util.List;

public class FarmExpenses {
	public static double calculateTotalPlantProfit(List<Seed> plants) {
		double totalPlantProfit = 0;
		for(Plant plant : plants) {
			try {
				totalPlantProfit += plant.seedProfit();
			}catch (UnsuccessfulHarvestException e) {
				System.out.println("Exception : " + e.getMessage());
			}
		}
		return totalPlantProfit;
	}
	
	public static double calculateTotalAnimalProfit(List<FarmAnimal> animals) {
		double totalAnimalProfit = 0;
		for(Animal animal : animals) {
			totalAnimalProfit += animal.calculateProfit();
		}
		return totalAnimalProfit;
	}
	
	public static double calculateTotalPlantMaintenanceCost(List<Seed> plants) {
		double totalPlantMaintenanceCost = 0;
		for(Plant plant : plants) {
			totalPlantMaintenanceCost += ((Seed) plant).getMaintanceCost();
		}
		return totalPlantMaintenanceCost;
	}
	
	public static double calculateTotalAnimalMaintenanceCost(List<FarmAnimal> animals) {
		double totalAnimalMaintenanceCost = 0;
		for(Animal animal : animals) {
			totalAnimalMaintenanceCost += ((FarmAnimal) animal).getMaintanceCost();
		}
		return totalAnimalMaintenanceCost;
	}
}
