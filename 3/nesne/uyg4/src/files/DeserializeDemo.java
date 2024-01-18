package files;

import java.io.*;
import java.util.LinkedList;
public class DeserializeDemo {

   public static void main(String [] args) {

	  LinkedList<Employee> okunacak_liste;
      try {
         FileInputStream fileIn = new FileInputStream("myfile.ser");
         ObjectInputStream in = new ObjectInputStream(fileIn);
         
         //Employee e = (Employee) in.readObject();  //tek bir kayıt göndermiş olsam bu şekilde deserialize ederdim.
         okunacak_liste = (LinkedList<Employee>) in.readObject();
    
         in.close();
         fileIn.close();
      } catch (IOException i) {
         i.printStackTrace();
         return;
      } catch (ClassNotFoundException c) {
         System.out.println("Employee class not found");
         c.printStackTrace();
         return;
      }
      
      
      for(Employee iter: okunacak_liste)
    	  System.out.println(iter);

      
   }
}