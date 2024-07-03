const ModbusRTU = require("modbus-serial");
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const client = new ModbusRTU();

// modbus 통신을 위한 연결
client.connectTCP("Slave의 ip를 입력하세요", { port: 502 }, function (err) {
    if (err) {
        console.error("Connection Error:", err);
        return;
    }
    console.log("Connected to Modbus server");
    client.setID(1);
});

function readData() {
    return new Promise((resolve, reject) => {
        client.readHoldingRegisters(0, 10, function (err, data) {
            if (err) {
                reject("Read Error:", err);
            } else {
                resolve(data.data);
            }
        });
    });
}

// modbus data를 전송하기 위한 websocket 사용
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // change to localhost
        methods: ["GET", "POST"],
    }
});

// 클라이언트가 연결되었을 때 Modbus 데이터를 주기적으로 읽어서 전송
io.on('connection', (socket) => {
    console.log('Client connected');

    const interval = setInterval(async () => {
        try {
            const data = await readData();
            socket.emit('0', data[0]);
            socket.emit('1', data[0]);
            socket.emit('2', data[0]);
            socket.emit('3', data[0]);
            socket.emit('4', data[0]);
            socket.emit('5', data[0]);
            socket.emit('6', data[0]);
            socket.emit('7', data[0]);
            socket.emit('8', data[0]);
            socket.emit('9', data[0]);
        } catch (err) {
            console.error(err);
        }
    }, 100); // 0.1초마다 데이터 전송

    socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server is listening on port 3001');
});
