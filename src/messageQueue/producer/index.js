const amqplib = require('amqplib');

const url = 'amqps://twhysjvt:939fobRfD1k8noeFa7wSCDjSL2nvaPsB@armadillo.rmq.cloudamqp.com/twhysjvt';

class Producer {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async createChannel() {
        try {
            this.connection = await amqplib.connect(url);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error('Error creating AMQP channel:', error);
            throw error;
        }
    }

    async sendMessage(queueTask, message) {
        try {
            if (!this.channel) {
                await this.createChannel();
            }
            await this.channel.assertQueue(queueTask, {
                durable: true
            });
            const msgBuffer = Buffer.from(typeof message === 'object' ? JSON.stringify(message) : message);
            this.channel.sendToQueue(queueTask, msgBuffer);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            console.error('Error closing AMQP connection:', error);
        }
    }
}

module.exports = new Producer(); 