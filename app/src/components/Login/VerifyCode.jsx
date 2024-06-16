import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import s from "./Login.module.css";

function VerifyCode() {

    const [attempts, setAttempts] = useState(0);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber } = location.state || {};

    const handleVerifyCode = async (code) => {
        const response = await fetch('http://localhost:3001/api/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, code })
        });

        const result = await response.json();
        console.log(result);
        localStorage.setItem("user-information", JSON.stringify(result.user));
        if (result.success) {
            navigate('/dashboard');
        } else {
            setAttempts(attempts + 1);
            if (attempts >= 2) {
                setShowCaptcha(true);
            }
        }
    };

    const handleCaptchaVerify = () => {
        setShowCaptcha(false);
        setAttempts(0);
    };

    const handleInputClick = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();

            await handleVerifyCode(clipboardText);
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    return (
        <div className={s.container}>
            <h2>Введите код подтверждения</h2><br/>
            <input
                type="text"

                onClick={handleInputClick}
                placeholder="Код подтверждения"
            />
            {/*<button onClick={handleVerifyCode}>Подтвердить</button>*/}
            {showCaptcha && (
                <ReCAPTCHA
                    sitekey="your-site-key"
                    onChange={handleCaptchaVerify}
                />
            )}
        </div>
    );
}

export default VerifyCode;
