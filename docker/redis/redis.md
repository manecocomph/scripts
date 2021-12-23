** install
https://hub.docker.com/_/redis
```
$ docker network create redis-network
$ sudo docker run --network redis-network --restart always --volume /home/supra/work/data/redis/data:/data --name redis -p 6379:6379 -d redis redis-server --save 60 1 --loglevel warning
```

connect from command line
```
$ docker run -it --network redis-network --rm redis redis-cli -h redis
```
