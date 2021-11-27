### install ES & Kibana
doc: https://www.elastic.co/guide/en/kibana/current/docker.html
```
sudo docker network create elastic-network
sudo docker run --restart always --name es01 --network elastic-network -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -d docker.elastic.co/elasticsearch/elasticsearch:7.15.2
sudo docker run --restart always --name kib01 --network elastic-network -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://es01:9200" -d docker.elastic.co/kibana/kibana:7.15.2
```
