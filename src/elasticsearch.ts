import {Client} from '@elastic/elasticsearch';

export {putDocument, deleteDocument}

// Create an Elasticsearch client instance
const client = new Client({node: 'http://localhost:9200'}); // Replace with your Elasticsearch server address

async function putDocument(index: string, id: string, document: Record<string, any>) {
    try {
        const response = await client.index({
            index,
            id,
            document
        });
        console.log(`Document indexed successfully. Index: ${response._index}, ID: ${response._id}`);
    } catch (error) {
        console.error('Error indexing document:', error);
    }
}

async function deleteDocument(index: string, id: string) {
    try {
        const response = await client.delete({
            index,
            id
        });
        console.log(`Document deleted successfully. Index: ${response._index}, ID: ${response._id}`);
    } catch (error) {
        console.error('Error indexing document:', error);
    }
}
