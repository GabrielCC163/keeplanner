import React from 'react';

export default function InputField({ placeholder, value, handleChange, edicao }) {
	return (
		<div className="actions__input-field">
			<input placeholder={placeholder} type="text" value={value} onChange={handleChange} />
		</div>
	);
}
