import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
const socket = io.connect("http://localhost:3001"); // 서버의 IP 주소 확인

function Mdbus(){
    const [message, setMessage] = useState("");

    useEffect(() => {
        const handleServerData = (data) => {
            console.log(data);
            setMessage(data);
        };

        socket.on('modbusData', handleServerData);

        return () => {
            socket.off('modbusData', handleServerData);
        };
    }, []);

    return (
        <div className="Mdbus">
            <h1>Modbus Message: {message}</h1>
        </div>
    );
}

export default Mdbus;