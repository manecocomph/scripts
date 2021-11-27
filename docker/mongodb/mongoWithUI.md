## setup network and install mongoDB and webUI
```
sudo docker network create mongo-network  
sudo docker run --network mongo-network --restart always -p 27017:27017 --volume /home/supra/work/data/mongo/grafana:/data/db --name mongodb -d mongo  
sudo docker run --network mongo-network --restart always -e ME_CONFIG_MONGODB_SERVER=mongodb -p 8081:8081 --name mongoui mongo-express  
```

### import data (each json per line)
```
mongoimport --db dbName --collection collectionName --file fileName.json 
```

### create full text search and search 
doc: https://docs.mongodb.com/manual/text-search/
```
db.srestar.createIndex({title: "text", folder: "text", panels: "text", });
db.srestar.find({$text: {$search: "EricTian"}});
```
