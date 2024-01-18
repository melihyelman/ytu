package melihyelman;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class FileUtility {

	public static List<Staff> readStaffFromFile(String fileName) {
		try {
		      File myObj = new File(fileName);
		      Scanner myReader = new Scanner(myObj);
		      List<Staff> dataList = new ArrayList<>();
		      
		      while (myReader.hasNextLine()) {
		        String data = myReader.nextLine();
		        String[] sData = data.split(",");
		        
		        if(sData[0].compareTo("Academic") == 0) {
		        	AcademicStaff temp = new AcademicStaff(sData[1], Double.parseDouble(sData[2]), Integer.parseInt(sData[3]));
			        dataList.add(temp);
		        }else {
		        	Staff temp = new Staff(sData[1], Double.parseDouble(sData[2]));
			        dataList.add(temp);
		        }
		      }
		      
		      myReader.close();
		      return dataList;
		    } catch (FileNotFoundException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		    }
		return null;
	}
	
	public static void writeStaffToFile(List<Staff> staffList, String fileName) {
		try {
		      FileWriter myWriter = new FileWriter(fileName);
		      
		      for(Staff staff: staffList) {
		    	  myWriter.write(staff.toString() + "\n");
		      }
		      
		      myWriter.close();
		    } catch (IOException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		}
	}
	
}
