package casting;
class Animal {
    @Override
    public String toString() {
        return "This is an Animal";
    }

    public String eat() {
        return "Animal is eating";
    }
}

class Dog extends Animal {
    @Override
    public String toString() {
        return "This is a Dog";
    }

    public String eat() {
        return "Dog is eating";
    }

    public String bark() {
        return "Dog is barking";
    }
}

public class Casting2 {
    public static void main(String args[]) {
        // 1. Dog nesnesi oluşturuluyor ve metotları çağrılıyor
        Dog d = new Dog();
        System.out.println(d); // Çıktı: This is a Dog
        System.out.println(d.eat()); // Çıktı: Dog is eating
        System.out.println(d.bark()); // Çıktı: Dog is barking

        System.out.println("1------------------------");

        // 2. Animal nesnesi oluşturuluyor ve metotları çağrılıyor
        Animal anim = new Animal();
        System.out.println(anim); // Çıktı: This is an Animal
        System.out.println(anim.eat()); // Çıktı: Animal is eating

        System.out.println("2------------------------");

        // 3. Upcasting: Dog nesnesi Animal türüne dönüştürülüyor
        anim = d;
        System.out.println(anim); // Çıktı: This is a Dog
        System.out.println(anim.eat()); // Çıktı: Dog is eating
        // Not: anim.bark() çağrısı yapılamaz, çünkü anim Animal türünde

        System.out.println("3------------------------");

        // 4. Güvenli Downcasting: Animal nesnesi (Dog türünde) Dog türüne dönüştürülüyor
        if (anim instanceof Dog) {
            Dog dog = (Dog) anim;
            System.out.println(dog.bark()); // Çıktı: Dog is barking
        }

        System.out.println("4------------------------");
        
        // 6. Güvenli Downcasting Denemesi: Animal türünde bir nesne Dog türüne dönüştürülmeye çalışılıyor
        Animal anotherAnimal = new Animal(); // Bu sefer sadece bir Animal oluşturuluyor
        if (anotherAnimal instanceof Dog) {
            Dog dog = (Dog) anotherAnimal;
            System.out.println(dog.bark()); // Bu satır çalışmayacak çünkü anotherAnimal bir Dog değil
        } else {
            System.out.println("anotherAnimal bir Dog değil, downcasting yapılamıyor.");
        }

        System.out.println("6------------------------");
        
        // 5. Downcasting: Başka bir Animal referansı Dog nesnesine dönüştürülüyor
        Animal anotherAnim = new Dog();
        // System.out.println(anotherAnim.bark());
        Dog anotherDog = (Dog) anotherAnim;
        System.out.println(anotherDog); // Çıktı: This is a Dog
        System.out.println(anotherDog.bark()); // Çıktı: Dog is barking
 
        System.out.println("5------------------------");
    }
}