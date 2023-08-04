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


function parseToot(value: Buffer): Toot {
    const toot: Toot = JSON.parse(value.toString());
    toot.domain = toot.account.acct?.match(/@(.+)/)?.[1] || null;
    return toot;
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
                switch(headers?.type?.toString() as EventType) {
                    case "update":
                        const tootObj = parseToot(value);
                        await putDocument("toots", tootObj.id, tootObj);
                        break;
                    case "status.update":
                        const tootObj2 = parseToot(value);
                        await putDocument("toots", tootObj2.id, tootObj2);
                        break;
                    case "delete":
                        // await deleteDocument("toots", toot.toString())
                        break;
                    default:
                        console.log('Huh?');
                }
            }
        }
    });
}

export {sendMessage, consumeMessages, EventType}