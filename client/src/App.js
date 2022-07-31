import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import ControlRecords from './components/ControlRecords';
import Login from './components/Login';
import useToken from './components/useToken';

export default function App() {
	const { token, setToken, removeToken } = useToken();
	
	if (!token) {
		return <Login setToken={setToken} />
	}

	return (
		<div className="wrapper">
			<h1>Keeplanner</h1>
			<button onClick={removeToken}>Logout</button>
			<BrowserRouter>
				<Routes>
					<Route path="/controle-financeiro" element={<ControlRecords userToken={`Bearer ${token}`} />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}
