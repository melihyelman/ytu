package melihyelman;

public class Basket {
	private int ID;
	private Item[] items;
	private MarketCard card;

	public Basket(int id) {
		this.ID = id;
		items = new Item[2];
	}

	public void addItem(Item item) {
		int i = 0;
		while (i < items.length && items[i] != null) {
			i++;
		}
		if (i == items.length) {
			System.out.println("You've reached the maximum amount of items in your basket.");
		} else {
			items[i] = item;
		}
	}

	public void basketInfo() {
		int count = 0;
		double totalPrice = 0;
		while (count < items.length && items[count] != null) {
			totalPrice += items[count].getPrice();
			count++;
		}
		System.out.println("Basket ID: " + this.ID + " Number of items : " + count + " Total price: " + totalPrice);

		if (this.card != null) {
			for (int i = 0; i < this.items.length; i++) {
				if (items[i] != null) {
					card.addPoints(items[i].getPrice() * 0.1);
				}
			}
		}
	}

	public void setCard(MarketCard card) {
		this.card = card;
	}

}
