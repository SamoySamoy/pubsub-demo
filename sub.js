import amqplib from "amqplib";
const amqp_url = "amqp://localhost:5672";

const receiveVideo = async () => {
    try {
        // connection
        const conn = await amqplib.connect(amqp_url);

        // create channel (binding with exchange)
        const channel = await conn.createChannel();

        // create exchange
        const exchangeName = "video";
        await channel.assertExchange(exchangeName, "fanout", {
            durable: false,
        });

        // create queue
        const { queue } = await channel.assertQueue("", {
            exclusive: true,
        });
        console.log(`queueName::: ${queue}`);

        // binding
        await channel.bindQueue(queue, exchangeName, "");

        // consume
        await channel.consume(
            queue,
            (msg) => {
                console.log(`msg::`, msg.content.toString());
            },
            { noAck: true }
        );
    } catch (error) {
        console.error(error.message);
    }
};

const msg = process.argv.slice(2).join(" ") || "Hello";
receiveVideo();
