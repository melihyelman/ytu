package files;

import java.io.FileWriter;   
import java.io.IOException;  

public class WriteToFile {
  public static void main(String[] args) {
	  
    try {
      FileWriter myWriter = new FileWriter("dosyam.txt");
      myWriter.write("ad,soyad,35.0\n");
      myWriter.write("ad2,soyad2,25.0\n");
      myWriter.close();
      System.out.println("Successfully wrote to the file.");
    } catch (IOException e) {
      System.out.println("An error occurred.");
      e.printStackTrace();
    }
  }
}