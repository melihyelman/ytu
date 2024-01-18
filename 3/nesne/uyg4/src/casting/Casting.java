package casting;
public class Casting {

	public static void main(String[] args) {
		// byte -> short -> char -> int -> long -> float -> double
		
				//wadening casting - automatic
				int x = 5;
				double y = x;
				System.out.println(x);  
				System.out.println(y);
				System.out.println("--------------------------");
				
				
				char c = 'A';
				int c_i = c;
				System.out.println(c_i); //ascii tablosundan dönüşüm yapıyor.
				
				
				//narrowing casting - manual 
				double a = 7.8;
				int b = (int) a;
				System.out.println(b);
				
				System.out.println("--------------------------");
				
				
				// String dönüşümlerinde parse kullanırız.
				String yas = "80";
				//double yas_d = (double)yas;  bu ifade hatalıdır.
				double yas_d = Double.parseDouble(yas);
				System.out.println(yas_d);
				int yas_i = Integer.parseInt(yas); 
				System.out.println(yas_i);
				
				System.out.println("--------------------------");
				
				double d_x = 8.8;
				String s_x = Double.toString(d_x);
				String s_x2 = String.valueOf(d_x);
				
				System.out.println(d_x);
				System.out.println(s_x);
				System.out.println(s_x2);
				
				//System.out.println(d_x.getClass());
				//System.out.println(s_x.getClass());
				
				
				// System.out.println(d_x.length());
				System.out.println(s_x.length());
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
	}

}