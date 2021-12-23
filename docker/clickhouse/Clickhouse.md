** install

```
docker run -d --name clickhouse-server --ulimit nofile=5120:5120 --volume=/home/supra/work/data/clickhouse:/var/lib/clickhouse -p 8123:8123 -p 9000:9000 yandex/clickhouse-server
```
