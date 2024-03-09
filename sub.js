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
        await channel.assertExchange(exchangeName, "topic", {
            durable: false,
        });

        // create queue
        const { queue } = await channel.assertQueue("", {
            exclusive: true,
        });
        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0);
        }
        console.log(`waiting queue::${queue}::::topic::${args}`);

        // binding
        args.forEach(async (key) => {
            await channel.bindQueue(queue, exchangeName, key);
        });

        // consume
        await channel.consume(
            queue,
            (msg) => {
                console.log(
                    `Routing key::${
                        msg.fields.routingKey
                    }::::msg::${msg.content.toString()}`
                );
            },
            { noAck: true }
        );
    } catch (error) {
        console.error(error.message);
    }
};

receiveVideo();
