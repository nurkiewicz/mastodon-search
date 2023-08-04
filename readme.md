```bash
docker exec -it masearch_kafka \
  /opt/kafka/bin/kafka-console-consumer.sh \
  --topic raw_toots \
  --bootstrap-server localhost:9092 \
  --from-beginning
```