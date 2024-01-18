package files;

import java.io.*;
import java.util.LinkedList;
public class SerializeDemo {

   public static void main(String [] args) {
      Employee e = new Employee("Ali Demir", "İstanbul", 11122333, 101);
      Employee e2 = new Employee("Veli Bakır", "Ankara", 222333444, 202);
      
      LinkedList<Employee> listem = new LinkedList<>();
      listem.add(e);
      listem.add(e2);
      
      try {
         FileOutputStream fileOut = new FileOutputStream("myfile.ser");
         ObjectOutputStream out = new ObjectOutputStream(fileOut);
         out.writeObject(listem);
         out.close();
         fileOut.close();
         System.out.printf("Serialized data is saved.");
      } catch (IOException i) {
         i.printStackTrace();
      }
   }
}
