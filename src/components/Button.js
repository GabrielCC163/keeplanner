import React from 'react';

export default function Button({ text, handleClick }) {
	return (
		<button className="waves-effect waves-light btn" onClick={handleClick}>
			{text}
		</button>
	);
}
