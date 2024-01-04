// components/Alert.tsx
import React, { useState, useEffect } from 'react';

const Alert = ({ message }) => {
    const [show, setShow] = useState(false);
    const [showMsg, setShowMsg] = useState("");

    useEffect(() => {
        if (message) {
            setShow(true);
            setShowMsg(message.split("|")[0]);
            const timeout = setTimeout(() => {
                setShow(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    if (!show) return null;

    return (
        <div className="fixed w-full sd:max-w-4 inset-0 flex items-center justify-center">
            <div className="bg-blue-300 prounded-l shadow-lg bg-blue-300 flex items-center ">
                <span className="mr-2 p-4 text-white truncate">{showMsg}</span>
            </div>
            <div className="bg-blue-300 rounded-r shadow-lg bg-blue-300 flex items-center">
                <button onClick={() => setShow(false)} className="p-4 border-l border-white text-white font-bold">X</button>
            </div>
        </div>
    );
};

export default Alert;
