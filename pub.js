import amqplib from "amqplib";
const amqp_url = "amqp://localhost:5672";

const postVideo = async (msg) => {
    try {
        // connection
        const conn = await amqplib.connect(amqp_url);

        // create channel
        const channel = await conn.createChannel();

        // create exchange
        const exchangeName = "video";
        await channel.assertExchange(exchangeName, "fanout", {
            durable: false,
        });
        // publish message
        await channel.publish(exchangeName, "", Buffer.from(msg));

        console.log(`[x] Send Ok:::${msg}`);

        setTimeout(function () {
            conn.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error(error.message);
    }
};

const msg = process.argv.slice(2).join(" ") || "Hello";
postVideo(msg);
