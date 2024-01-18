package files;

@SuppressWarnings("serial")
public class Employee implements java.io.Serializable {
	
	   public String name;
	   public String address;
	   public transient int SSN;
	   public int number;
	   
	   
		public Employee(String name, String address, int sSN, int number) {
		super();
		this.name = name;
		this.address = address;
		SSN = sSN;
		this.number = number;
	}



		@Override
		public String toString() {
			return "Employee [name=" + name + ", address=" + address + ", SSN=" + SSN + ", number=" + number + "]";
		}
	   
}
	   
	


