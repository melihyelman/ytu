package farming;

import java.util.ArrayList;
import java.util.Random;

public class FarmAnimal implements Animal {
	private double weight, maintanceCost, valuePerKg;
	
	public FarmAnimal(double weight, double maintanceCost, double valuePerKg) {
		this.weight = weight;
		this.maintanceCost = maintanceCost;
		this.valuePerKg = valuePerKg;
	}
	@Override
	public double calculateProfit() {
		return (weight*valuePerKg)- (maintanceCost*valuePerKg);
	}
	
	@Override
	public void feed() {
		System.out.println("Feeding farm animal...");
		System.out.println("Animal fed.");
	}
	
	public double getMaintanceCost() {
		return maintanceCost;
	}
	
	private static ArrayList<FarmAnimal> createRandomFarmAnimals() {
		ArrayList<FarmAnimal> animals = new ArrayList<>();
		
		Random random = new Random();
		
		int numberOfAnimals = (int) (Math.random()* 10)+1;
		for(int i = 0; i < numberOfAnimals; i++) {
			double weight = random.nextDouble() * 200 + 1;
			double maintanceCost = random.nextDouble() * 100 + 1;
			double valuePerKg = random.nextDouble() * 10 + 1;
			animals.add(new FarmAnimal(weight,maintanceCost,valuePerKg));
		}
		System.out.println("Total number of animals " + numberOfAnimals);
		return animals;
	}
	public static ArrayList<FarmAnimal> getCreatedAnimals() {
		return createRandomFarmAnimals();
	}
}
