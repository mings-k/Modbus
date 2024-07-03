const readData = require('./index');

async function fetchData() {
    try {
        const data = await readData();
        console.log("Modbus Data:", data);
    } catch (error) {
        console.error(error);
    }
}

setInterval(fetchData, 1000);
