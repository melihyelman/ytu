package farming;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FarmTest {
	public static void main(String[] args) throws UnsuccessfulHarvestException {
		double mainProfit, totalPlantProfit = 0, totalAnimalProfit, totalPlantMaintenanceCost = 0, totalAnimalMaintenanceCost = 0;
		
		Farmer f1 = new Farmer(234, "Ellie Brown");
		Farmer f2 = new Farmer(345, "Mike Garret");
		Farmer f6 = new Farmer(123, "Mike Garret");
		
		ArrayList<Farmer> perList = new ArrayList<>();
		perList.add(f1);
		perList.add(f2);
		perList.remove(f6);
		System.out.println("*************Info*********");
		InfoClass.getListInfo(perList);
		
		System.out.println("*************Case*********");
		Seed corn = new Seed(100,2.5,40);
		Seed wheat = new Seed(80,3,30);
		Seed tomato = new Seed(120,1.5,50);
		InfoClass.getObjectInfo(corn);
		InfoClass.getObjectInfo(wheat);
		InfoClass.getObjectInfo(tomato);
		
		List<Seed> plants = new ArrayList<>();
		plants.add(corn);
		plants.add(wheat);
		plants.add(tomato);
		
		for(Seed plant : plants) {
			plant.performHarvest();
		}
		
		List<FarmAnimal> farmAnimals = FarmAnimal.getCreatedAnimals();
		
		for(FarmAnimal animal : farmAnimals) {
			animal.feed();
		}
		totalPlantProfit = FarmExpenses.calculateTotalPlantProfit(plants);
		totalAnimalProfit = FarmExpenses.calculateTotalAnimalProfit(farmAnimals);
		totalPlantMaintenanceCost = FarmExpenses.calculateTotalPlantMaintenanceCost(plants);
		totalAnimalMaintenanceCost = FarmExpenses.calculateTotalAnimalMaintenanceCost(farmAnimals);
		
		mainProfit = (totalPlantProfit + totalAnimalProfit) - (totalPlantMaintenanceCost + totalAnimalMaintenanceCost);
		
		System.out.println("\n******* calculating profit *********");
		System.out.println("Total Plant Profit: $" + totalPlantProfit);
        System.out.println("Total Animal Profit: $" + totalAnimalProfit);
        System.out.println("Total Plant Maintenance Cost: $" + totalPlantMaintenanceCost);
        System.out.println("Total Animal Maintenance Cost: $" + totalAnimalMaintenanceCost);
        System.out.println("Total Farm Profit: " + mainProfit);
        
        Farmer f3 = new Farmer(111 , "Calleb Harris");
        Farmer f4 = new Farmer(222 , "Christy Clark");
        
        Map<Integer, Farmer> farmerMap = new HashMap<>();
        
        farmerMap.put(f3.getId(), f3);
        farmerMap.put(f4.getId(), f4);  
        farmerMap.put(f1.getId(), f1); 
        System.out.println("\n********* Farmer HashMap Example *********");
        int farmerIdToLookup = 234;
        Farmer farmerToLookup = farmerMap.get(farmerIdToLookup);
        if (farmerToLookup != null) {
            System.out.println("Farmer found in HashMap: " + farmerToLookup);
        } else {
            System.out.println("Farmer with ID " + farmerIdToLookup + " not found.");
        }
	}	
}
