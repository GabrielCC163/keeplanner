import dotenv from 'dotenv';

dotenv.config();

const base_url =
	process.env.NODE_ENV === 'production' ? 'https://igti-finance-control.herokuapp.com' : 'http://localhost:6001';

export { base_url };
