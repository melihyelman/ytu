package inner_class;

class OuterClass {
	 int x = 10;

	 class InnerClass {
	    int x = 5;
	  }

}

public class Test1 {
	  public static void main(String[] args) {
	    OuterClass myOuter = new OuterClass();
	    //InnerClass myInner = new InnerClass(); //buna izin verilmez.
	    OuterClass.InnerClass myInner = myOuter.new InnerClass();
	    System.out.println(myInner.x);
	    System.out.println(myOuter.x);
	    
	  }
	}