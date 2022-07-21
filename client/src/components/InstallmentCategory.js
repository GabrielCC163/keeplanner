import React from 'react';

export default function InstallmentCategory({ id, description, dueDay, dueMonth, index }) {

	return (
		<li style={{background: 'grey'}}>{description}</li>
    )
}