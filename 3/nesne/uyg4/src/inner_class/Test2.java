package inner_class;

// static inner class örneği - üst sınıf nesnesine gerek yok.
class OuterClass2 {
	  int x = 10;

	  static class InnerClass2 {
	    int x = 5;
	  }
	}

public class Test2 {
	  public static void main(String[] args) {
	    OuterClass2.InnerClass2 myInner = new OuterClass2.InnerClass2();
	    System.out.println(myInner.x);
	  }
	}
