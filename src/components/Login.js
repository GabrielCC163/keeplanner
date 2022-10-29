import React, { useState } from 'react';
import { base_url } from '../config';
import axios from 'axios';
import PropTypes from 'prop-types';

import './login.css';

async function loginUser(credentials) {
    return await axios.post(`${base_url}/auth/signin`, credentials);
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [ error, setError ] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await loginUser({
              username,
              password
            });
            
            setToken({token: result.data.token});
        } catch (error) {
            if (error.response && error.response.status && error.response.status === 400) {
                setError('Senha deve conter ao menos 7 caracteres.')
            } else {
                setError('Senha inválida.')
            }
        }
    }

    return(
        <div className="login-wrapper">
            <h1>Keeplanner</h1>
            <span>Faça seu login, ou crie uma conta.</span>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Usuário</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Senha</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Login / Cadastro</button>
                </div>
                <span>{error}</span>
            </form>
        </div>
    )
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
}