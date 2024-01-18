package multithreading;

public class ThreadOlusturma3 {

	public static void main(String[] args) throws InterruptedException  {
		
		Increaser3 i1 = new Increaser3("nesne1"); 
		Increaser3 i2 = new Increaser3("nesne2"); 
		
		Thread t1 = new Thread(i1);
		Thread t2 = new Thread(i2);
		
		t1.start();
		t2.start();
		

		t1.join();
		t2.join();

		
		System.out.println("Son");
		
		System.out.println(i1.sayi);
		System.out.println(i2.sayi);
		
	}
}

class Increaser3 implements Runnable {
    public static int sayi = 5;
    private String name;
    
    public Increaser3(String name) {
        this.name = name;
    }

    public static synchronized void add() {
        for (int i = 0; i < 10000; i++) {
            sayi++;
            sayi--;
        }
        
        System.out.println(Thread.currentThread().getName() + " çalıştı, sayı değeri artık= " + sayi);
    }

    @Override
    public void run() {
        add();
    }
}



