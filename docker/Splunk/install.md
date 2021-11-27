## install 
```
sudo docker run --rm -p 8000:8000 -e "SPLUNK_START_ARGS=--accept-license"  -e "SPLUNK_PASSWORD=admin" --name splunk splunk/splunk
```
