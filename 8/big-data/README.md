## Softwares

Docker + Docker Compose

Java 11+

Maven 3.6+


## Run

1- Run Docker

  docker compose up -d

  namenode ui http://localhost:9870 page

2- Add hostname 

  sudo sh -c 'echo "127.0.0.1 namenode datanode1 datanode2 resourcemanager nodemanager1 historyserver" >> /etc/hosts'

  Windows: C:\Windows\System32\drivers\etc\hosts dosyasına aynı satırı yönetici olarak ekleyin.

3- Run and Build

  first build: mvn -q -DskipTests package

  then run: java -jar target/movie-review-search.jar


## Usage

Once the application is running, follow these steps through the interface:

1- Upload Dataset

1.a- Navigate to the HDFS File Manager Menu

1.b- Click on Upload Raw Dataset and select the data/sample-10mb.json file. (You can reach the full dataset: https://www.kaggle.com/datasets/ebiswas/imdb-review-dataset)

1.c- Leave the dest. path as /raw/dataset.jsonl

1.d- Wait till you see the "Ingest Complete" message

2- Run Pipelines

2.a- Go to the MapReduce Job Monitör tab.

2.b- Click the Run Full Pipeline button start processing then you will see progres.


3- Search

3.a- Go to the search menu and click the Load Index button.

3.b- Type your query into the search box. The results will display the matching movie titles.

3.c- Click on any row in the results list to fetch and view the original review directly from HDFS.



Stoping the docker: To stop cluster, run docker compose down in your terminal (if you want to completely clear the data, add -v option)

Configs: Hadoop cluster settings are located in docker/hadoop.env, app connection and file path settings are in config.properties