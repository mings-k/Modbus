const ModbusRTU = require("modbus-serial");
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const client0 = new ModbusRTU();
const client3 = new ModbusRTU();

const MODBUS_IP = "";  // Modbus 장치의 IP 주소
const MODBUS_PORT = 502;      // Modbus TCP 포트

// client0: Coils 데이터를 읽기 위한 연결 설정
client0.connectTCP(MODBUS_IP, { port: MODBUS_PORT }, function (err) {
    if (err) {
        console.error("Connection Error for client0:", err);
        return;
    }
    console.log("Connected to Modbus server for client0");
    client0.setID(1);
});

// client3: Holding Registers 데이터를 읽기 위한 연결 설정
client3.connectTCP(MODBUS_IP, { port: MODBUS_PORT }, function (err) {
    if (err) {
        console.error("Connection Error for client3:", err);
        return;
    }
    console.log("Connected to Modbus server for client3");
    client3.setID(1);
});

// client0: Coils 데이터를 읽기 위한 함수
function readData0() {
    return new Promise((resolve, reject) => {
        client0.readCoils(0, 10, function (err, data) {
            if (err) {
                reject("Read Error for client0:", err);
            } else {
                resolve(data.data);
                console.log("data.data000:", data.data); // 값 출력
                console.log("타입000:", typeof data.data[0]); // 타입 출력
            }
        });
    });
}

// client3: Holding Registers 데이터를 읽기 위한 함수 (0번부터 10개의 레지스터를 읽음)
function readData3() {
    return new Promise((resolve, reject) => {
        client3.readHoldingRegisters(0, 10, function (err, data) {
            if (err) {
                reject("Read Error for client3:", err);
            } else {
                resolve(data.data);
                console.log("data.data333:", data.data); // 값 출력
                console.log("타입333:", typeof data.data); // 타입 출력
            }
        });
    });
}

// modbus data를 전송하기 위한 websocket 설정
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // 클라이언트 주소
        methods: ["GET", "POST"],
    }
});

// 클라이언트가 연결되었을 때 Modbus 데이터를 주기적으로 읽어서 전송
io.on('connection', (socket) => {
    console.log('Client connected');

    const interval = setInterval(async () => {
        try {
            const data0 = await readData0();
            const data3 = await readData3();

            console.log(data3);

            socket.emit('0', data0);
            socket.emit('3', data3);
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
