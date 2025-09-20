import numpy as np
import matplotlib.pyplot as plt
import copy

#7 adet 3x3'lük pattern döndürür.
def generate_pattern():
    return np.random.randint(2, size=(7, 3, 3))

# n kere 7 adet 3x3'lük pattern döndürür.
def generate_n_patterns(pop_size):
    return [generate_pattern() for _ in range(pop_size)]

# 3x3'lük gerçek resim parçası ile pattern arasındaki farkı hesaplar.
def calculate_loss(image_block, pattern):
    return np.sum(image_block != pattern)

# 3x3'lük gerçek resim parçasına en yakın pattern’i bulur.
def find_best_pattern(block, patterns):
    losses = [calculate_loss(block, p) for p in patterns]
    best_idx = np.argmin(losses)
    return patterns[best_idx], losses[best_idx]

# 7 adet 3x3'lük patternleri kullanarak resmi yeniden oluşturur.
def recreate_image(img, individual):
    reconstructed = np.zeros_like(img)
    for i in range(0, img.shape[0], 3):
        for j in range(0, img.shape[1], 3):
            block = img[i:i+3, j:j+3]
            best_pattern, _ = find_best_pattern(block, individual)
            reconstructed[i:i+3, j:j+3] = best_pattern
    return reconstructed

# O anki nesildeki bireyin tüm resimler için toplam loss’unu hesaplar.
def fitness(individual, original_images):
    total_loss = 0
    for img in original_images:
        reconstructed = recreate_image(img, individual)
        total_loss += np.sum(img != reconstructed)
    return total_loss

# Turnuva seçimi ile o anki nesilden bir birey seçer.
def tournament_selection(population, fitness_values, k=3):
    selected_indices = np.random.choice(len(population), k, replace=False)
    selected_fitness = [fitness_values[i] for i in selected_indices]
    best_idx = selected_indices[np.argmin(selected_fitness)]
    return population[best_idx]

# Yeni nesil için bireyleri seçer.
def select_population(population, fitness_values, num_to_select):
    return [tournament_selection(population, fitness_values) for _ in range(num_to_select)]

# İki birey arasında tek noktalı çaprazlama yapar.
def crossover(parent1, parent2):
    point = np.random.randint(1, 7)  # 1-6 arası rastgele kesim noktası
    child1 = np.concatenate((parent1[:point], parent2[point:]), axis=0)
    child2 = np.concatenate((parent2[:point], parent1[point:]), axis=0)
    return child1, child2

# Bireyin pattern’lerindeki pikselleri mutasyona uğratır.
def mutate(individual, mutation_rate=0.01):
    for pattern in individual:
        for i in range(3):
            for j in range(3):
                if np.random.rand() < mutation_rate:
                    pattern[i, j] = 1 - pattern[i, j]
    return individual

#Txt dosyasından resmi okuyarak numpy array’e çevirir.
def load_image_from_txt(filename):
    with open(filename, 'r') as f:
        lines = f.read().splitlines()
    img = np.array([[int(char) for char in line.strip()] for line in lines])
    return img

# Genetik algoritmayı çalıştırır.
# Popülasyon büyüklüğü, mutasyon oranı ve jenerasyon sayısı gibi parametreleri alır.
# Her jenerasyonda en iyi ve ortalama fitness değerlerini kaydeder.
# Ayrıca, ilk, orta ve son jenerasyondaki en iyi bireylerin pattern’lerini de kaydeder.
# Sonuç olarak en iyi bireyi, fitness değerlerini ve pattern’leri döndürür.
def genetic_algorithm(pop_size, mutation_rate, num_generations, original_images):
    population = generate_n_patterns(pop_size)
    best_fitness_history = []
    avg_fitness_history = []
    pattern_history = {}

    for generation in range(num_generations):
        # Mevcut popülasyon için fitness değerlerini hesapla.
        fitness_values = [fitness(ind, original_images) for ind in population]
        best_fitness = np.min(fitness_values)
        avg_fitness = np.mean(fitness_values)
        best_index = np.argmin(fitness_values)
        best_individual = population[best_index]
        
        # Belirli jenerasyonlarda pattern setini kaydet
        if generation in [0, num_generations//2, num_generations-1]:
            pattern_history[generation] = copy.deepcopy(best_individual)
        
        best_fitness_history.append(best_fitness)
        avg_fitness_history.append(avg_fitness)
        
        # Yeni nesil oluşturma: turnuva seçimi, çaprazlama ve mutasyon.
        selected_population = select_population(population, fitness_values, pop_size)
        
        #yeni bireyleri oluşturma
        offspring = []
        if len(selected_population) % 2 != 0: # popülasyon tek ise çift yap
            selected_population.append(selected_population[np.random.randint(0, len(selected_population))])
        
        for i in range(0, len(selected_population), 2):
            child1, child2 = crossover(selected_population[i], selected_population[i+1]) # iki bireyden çocuk oluştur
            offspring.append(child1)
            offspring.append(child2)
        
        # Offspringler belirlenen mutasyon oranına göre mutasyona uğratılarak yeni popülasyonu oluşturuyor.
        population = [mutate(ind, mutation_rate) for ind in offspring[:pop_size]]

    # Son jenerasyonda en iyi bireyi belirle.
    fitness_values = [fitness(ind, original_images) for ind in population]
    best_index = np.argmin(fitness_values)
    best_individual = population[best_index]
    history = {"best": best_fitness_history, "avg": avg_fitness_history}
    return best_individual, history, pattern_history

# denyeklerin sonuçlarını test etmek için kullanılan fonksiyon.
# Bu fonksiyon, farklı hiperparametre ayarlarını test eder ve sonuçları kaydeder.
# Her deney için popülasyon büyüklüğü ve mutasyon oranı ayarlanır.
# jenerasyon bazındaki en iyi ve ortalama fitness, final fitness, başlangıç, orta ve son pattern'ler gibi verileri içerir.
def test_generic_algorithm(original_images):
    experiment_results = []
    # Denenecek hiperparametre kombinasyonları
    hyperparams = [
        {"pop_size": 10, "mutation_rate": 0.02, "num_generations": 100},
        {"pop_size": 10, "mutation_rate": 0.01, "num_generations": 100},
        {"pop_size": 10, "mutation_rate": 0.005, "num_generations": 100},
        {"pop_size": 100, "mutation_rate": 0.02, "num_generations": 100},
        {"pop_size": 100, "mutation_rate": 0.01, "num_generations": 100},
        {"pop_size": 100, "mutation_rate": 0.005, "num_generations": 100},
        {"pop_size": 500, "mutation_rate": 0.02, "num_generations": 100},
        {"pop_size": 500, "mutation_rate": 0.01, "num_generations": 100},
        {"pop_size": 500, "mutation_rate": 0.005, "num_generations": 100},
    ]
    
    for params in hyperparams:
        print(f"\nDeney: Popülasyon = {params['pop_size']}, Mutasyon Oranı = {params['mutation_rate']}")
        best_ind, history, pattern_hist = genetic_algorithm(
            pop_size=params["pop_size"],
            mutation_rate=params["mutation_rate"],
            num_generations=params["num_generations"],
            original_images=original_images
        )
        final_best_fitness = history["best"][-1]
        experiment_results.append({
            "pop_size": params["pop_size"],
            "mutation_rate": params["mutation_rate"],
            "num_generations": params["num_generations"],
            "final_best_fitness": final_best_fitness,
            "history": history,
            "pattern_hist": pattern_hist,
            "best_ind": best_ind
        })
        print(f"\nSonuc: En iyi fitness = {final_best_fitness}, Ortalama fitness = {history['avg'][-1]}")
    return experiment_results

if __name__ == "__main__":
    # Resim dosyaları yolları
    filenames1 = ["./images/image1_1.txt", "./images/image1_2.txt", "./images/image1_3.txt", "./images/image1_4.txt", "./images/image1_5.txt"]
    filenames2 = ["./images/image2_1.txt", "./images/image2_2.txt", "./images/image2_3.txt", "./images/image2_4.txt", "./images/image2_5.txt"]
    filenames3 = ["./images/image3_1.txt", "./images/image3_2.txt", "./images/image3_3.txt", "./images/image3_4.txt", "./images/image3_5.txt"]
    original_images = [load_image_from_txt(filename) for filename in filenames3]
    
    # Farklı hiperparametre deneyleri çalıştıralım.
    experiments = test_generic_algorithm(original_images)
    
    # Deney sonuçları genel bir özetini yazdıralım
    print("\n--- Deney Sonuçları Özeti ---")
    print("Popülasyon\tMutasyon Oranı\tFinal Best Fitness")
    for exp in experiments:
        print(f"{exp['pop_size']}\t\t{exp['mutation_rate']}\t\t{exp['final_best_fitness']}")
    
    # Her deney için jenerasyon bazında fitness değişimini çizelim.
    for idx, exp in enumerate(experiments):
        generations = list(range(1, exp["num_generations"] + 1))
        plt.figure(figsize=(8, 5))
        plt.plot(generations, exp["history"]["best"], label="En İyi Fitness")
        plt.plot(generations, exp["history"]["avg"], label="Ortalama Fitness")
        plt.xlabel("Nesil")
        plt.ylabel("Fitness (Loss)")
        plt.title(f"Deney {idx+1}: Popülasyon = {exp['pop_size']}, Mutasyon Oranı = {exp['mutation_rate']}")
        plt.legend()
        plt.show()
    
    # En iyi sonuçlardan birini seçerek grafikleri gösterelim
    best_experiment = min(experiments, key=lambda x: x["final_best_fitness"])
    print(f"\nEn iyi deney: Popülasyon = {best_experiment['pop_size']}, Mutasyon Oranı = {best_experiment['mutation_rate']}")
    
    # Seçilen en iyi deney için her resmin orijinal ve yeniden oluşturulan halini gösterelim.
    best_individual = best_experiment["best_ind"]
    fig, axes = plt.subplots(5, 2, figsize=(10, 20))
    for i in range(5):
        original = original_images[i]
        reconstructed = recreate_image(original, best_individual)
        difference = np.sum(original != reconstructed)
        
        axes[i, 0].imshow(original, cmap='gray')
        axes[i, 0].set_title(f"Orijinal Resim {i+1}")
        axes[i, 0].axis("off")
        
        axes[i, 1].imshow(reconstructed, cmap='gray')
        axes[i, 1].set_title(f"Yeniden Oluşturulan Resim {i+1}\nFark: {difference}")
        axes[i, 1].axis("off")
    
    plt.tight_layout()
    plt.show()

    generations = sorted(best_experiment["pattern_hist"].keys())
    num_gens = len(generations)
    
    # Her jenerasyonda bulunan pattern sayısı (örneğin, 7 adet)
    num_patterns = len(best_experiment["pattern_hist"][generations[0]])
    
    # Görselleştirme için subplot oluşturma: satır = jenerasyon, sütun = pattern
    fig, axs = plt.subplots(num_gens, num_patterns, figsize=(num_patterns*2, num_gens*2))
    
    for i, gen in enumerate(generations):
        patterns = best_experiment["pattern_hist"][gen]
        for j, pattern in enumerate(patterns):
            ax = axs[i, j] if num_gens > 1 else axs[j]
            ax.imshow(pattern, cmap='gray', interpolation='nearest')
            ax.axis('off')
            ax.set_title(f"P{j+1}", fontsize=8)
        axs[i, 0].set_ylabel(f"Gen {gen}", fontsize=10)
    
    plt.suptitle("Pattern Evrimi | İlk - Orta - Son", fontsize=14)
    plt.tight_layout()
    plt.show()
