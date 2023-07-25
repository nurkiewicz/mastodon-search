import {Consumer, EachMessagePayload, Kafka, Partitioners} from 'kafkajs';
import {Toot} from "./toot";
import {putDocument} from "./elasticsearch";

type EventType = 'update' | 'delete' | 'status.update';

async function sendMessage(topic: string, type: EventType, message: string) {
    const kafka = new Kafka({
        clientId: 'masearch',
        brokers: ['localhost:9092']
    });

    const producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner
    });
    try {
        await producer.connect();
        await producer.send({
            topic,
            messages: [{
                value: message,
                headers: { type }
            }]
        });
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        await producer.disconnect();
    }
}


async function consumeMessages(topic: string) {
    const kafka = new Kafka({
        clientId: 'masearch-consumer',
        brokers: ['localhost:9092']
    });

    const consumer: Consumer = kafka.consumer({ groupId: 'masearch-consumer-group' });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(`Consuming from ${topic}`)
    await consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
            const {offset, headers , value} = payload.message;
            if(value) {
                const toot = JSON.parse(value.toString());
                switch(headers?.type?.toString() as EventType) {
                    case "update":
                        const tootObj: Toot = toot;
                        console.log('Toot posted', offset, tootObj);
                        await putDocument("toots", tootObj.id, tootObj);
                        break;
                    case "status.update":
                        console.log('Toot updated', offset, toot);
                        break;
                    case "delete":
                        console.log('Toot deleted', offset, toot);
                        break;
                    default:
                        console.log('Huh?');
                }
            }
        }
    });
}

export {sendMessage, consumeMessages, EventType}