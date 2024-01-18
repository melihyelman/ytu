package multithreading;

public class ThreadOlusturma {

	public static void main(String[] args) throws InterruptedException {
		
		Increaser i1 = new Increaser("nesne1"); 
		Increaser i2 = new Increaser("nesne2"); 
		
		Thread t1 = new Thread(i1);
		Thread t2 = new Thread(i2);
		
		t1.start();
		t2.start();

		t1.join();
		t2.join();

		System.out.println("Son");
	}
}

class Increaser implements Runnable {
	public static int sayi=5;
	private String name;
	
	public Increaser(String name){
		this.name = name;
	}
	 public void add(){
		 sayi++;
		 System.out.println(name+" çalıştı, sayı değeri artık= "+sayi);
		
	 }
	@Override
	public void run() {
		add();
	}
	
	 
	
}



















