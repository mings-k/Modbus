const ModbusRTU = require("modbus-serial");
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const client0 = new ModbusRTU();
const client3 = new ModbusRTU();



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function connectClient0() {
    while (true) {
        try {
            await client0.connectTCP(MODBUS_IP, { port: MODBUS_PORT });
            client0.setID(1);
            console.log("Connected to Modbus server for client0");
            break;
        } catch (err) {
            console.error("Connection Error for client0:", err);
            await delay(5000); // 5초 후에 재시도
        }
    }
}

async function connectClient3() {
    while (true) {
        try {
            await client3.connectTCP(MODBUS_IP, { port: MODBUS_PORT });
            client3.setID(1);
            console.log("Connected to Modbus server for client3");
            break;
        } catch (err) {
            console.error("Connection Error for client3:", err);
            await delay(5000); // 5초 후에 재시도
        }
    }
}

// client0: Coils 데이터를 읽기 위한 함수
async function readData0() {
    if (!client0.isOpen) {
        console.warn("Port not open for client0. Attempting to reconnect...");
        await connectClient0();
    }

    return new Promise((resolve, reject) => {
        client0.readDiscreteInputs(0, 16, function (err, data) {
            if (err) {
                reject(`Read Error for client0: ${err.message || JSON.stringify(err)}`);
            } else {
                resolve(data.data);
                // console.log("data.data000:", data.data); // 값 출력
                console.log("타입000:", typeof data.data[0]); // 타입 출력
            }
        });
    });
}

// client3: Holding Registers 데이터를 읽기 위한 함수
async function readData3() {
    if (!client3.isOpen) {
        console.warn("Port not open for client3. Attempting to reconnect...");
        await connectClient3();
    }

    return new Promise((resolve, reject) => {
        client3.readInputRegisters(0, 30, function (err, data) {
            if (err) {
                reject(`Read Error for client3: ${err.message || JSON.stringify(err)}`);
            } else {
                const floatData = [];
                for (let i = 0; i < data.data.length; i += 2) {
                    // CD AB 형식으로 데이터 변환
                    const low = data.data[i]; // 하위 16비트
                    const high = data.data[i + 1]; // 상위 16비트
                    const buffer = Buffer.alloc(4);
                    buffer.writeUInt16BE(high, 0); // 상위 16비트
                    buffer.writeUInt16BE(low, 2); // 하위 16비트

                    // 32비트 float로 변환
                    floatData.push(buffer.readFloatBE(0));
                }
                resolve(floatData);
                console.log("floatData:", floatData); // 변환된 float 값 출력
                // console.log("타입333:", typeof floatData); // float 데이터 배열의 타입 출력
            }
        });
    });
}

// modbus data를 전송하기 위한 websocket 설정
const io = new Server(server, {
    cors: {
        origin: "*", // 클라이언트 주소
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

            // console.log(data3);
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

// 서버 시작 전에 Modbus 클라이언트 연결
async function startServer() {
    await connectClient0();
    await connectClient3();
    server.listen(3001, '0.0.0.0', () => {
        console.log('Server is listening on port 3001');
    });
}

startServer();
