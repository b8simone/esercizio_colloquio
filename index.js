const totalCPUs = require("os").cpus().length;
const express = require('express');
const cluster = require("cluster");
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.EXPRESS_PORT ?? 3000;

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });

} else {
    const app = express();

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
    app.use(bodyParser.json({ limit: '10mb' }));

    app.use('/books', require('./routes/books.js'));

    app.listen(parseInt(PORT), () => console.log(`Server started on port ${PORT}`));

}