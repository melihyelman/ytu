package multithreading;

public class ThreadOlusturma2 {

	public static void main(String[] args)  {
		
		Increaser2 i1 = new Increaser2("nesne1"); 
		Increaser2 i2 = new Increaser2("nesne2"); 
		
		
		i1.start();
		i2.start();
		
		
		
	}
}

class Increaser2 extends Thread {
	public static int sayi=5;
	private String name;
	
	public Increaser2(String name){
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

	
	 
	




















