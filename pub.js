import amqplib from "amqplib";
const amqp_url = "amqp://localhost:5672";

const postVideo = async () => {
    try {
        // connection
        const conn = await amqplib.connect(amqp_url);

        // create channel
        const channel = await conn.createChannel();

        // create exchange
        const exchangeName = "video";
        await channel.assertExchange(exchangeName, "topic", {
            durable: false,
        });

        const args = process.argv.slice(2);
        const msg = args[1] || "Fixed message";
        const topic = args[0];

        console.log(`msg::${msg}::::topic::${topic}`);
        // publish message
        await channel.publish(exchangeName, topic, Buffer.from(msg));

        console.log(`[x] Send Ok:::${msg}`);

        setTimeout(function () {
            conn.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
};

postVideo();
