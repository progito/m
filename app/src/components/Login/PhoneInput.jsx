// PhoneInput.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from "./Login.module.css";
function PhoneInput() {
    const [region, setRegion] = useState('+7'); // Значение по умолчанию для региона
    const navigate = useNavigate();

    const handleChangeInput = (value)=> {
        if (value.length === 10) {
            handleSendCode(value);
        }
    }

    const handleSendCode = async (phoneNumber) => {
        const fullPhoneNumber = `${region}${phoneNumber}`; // Складываем регион и номер телефона
        const response = await fetch('http://localhost:3001/api/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber: fullPhoneNumber })
        });

        if (response.ok) {
            console.log('Code sent successfully');
        } else {
            console.error('Failed to send code');
        }
        navigate('/verify-code', { state: { phoneNumber: fullPhoneNumber } });
    };

    return (
        <div className={s.container}> {/* Добавляем класс контейнера */}
            <h2>Введите номер телефона</h2><br/>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="+7">(🇷🇺+7)</option>
                <option value="+1">(🇺🇸+1)</option>
                {/* Добавьте другие регионы по необходимости */}
            </select>
            <input
                type="tel"
                onChange={(e) => handleChangeInput(e.target.value)}
                placeholder="91112223344"
            /><br/>
            {/*<button onClick={handleSendCode}>Отправить код</button>*/}
        </div>
    );
}

export default PhoneInput;
