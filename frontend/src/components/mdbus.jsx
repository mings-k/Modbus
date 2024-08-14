import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
const socket = io.connect("http://127.0.0.1:3001"); // 서버의 IP 주소 확인



function Mdbus(){
    const [message1, setMessage1] = useState([]);
    
    const [message2, setMessage2] = useState([]);

    useEffect(() => {
        const handleServerData1 = (data) => {
            setMessage1(data);
        };

        const handleServerData2 = (data) => {
            setMessage2(data);
        };

        socket.on('0', handleServerData1);
        socket.on('3', handleServerData2);

        return () => {
            socket.off('0', handleServerData1);
            socket.off('3', handleServerData2);
        };
    }, []);

    return (
        <div className="Mdbus" style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>0X 메세지</h1>
                {/* 0X 메세지는 True || False 값이므로 .toString을 사용 */}
                {message1.map((msg, index) => (
                    <h2 key={index}>{index} : {msg.toString()}</h2>
                ))}
            </div>
            <div style={{ textAlign: 'center' }}>
                <h1>3X 메세지</h1>
                {message2.map((msg, index) => (
                    <h2 key={index}>{index} : {msg}</h2>
                ))}
            </div>
        </div>
    );
}

export default Mdbus;