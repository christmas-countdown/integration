const fetch = require('node-fetch');
const {
	DISCORD_WEBHOOK,
	INCOMING_KEY
} = process.env;

module.exports.handler = async req => {

	if (req.queryStringParameters.key !== INCOMING_KEY) {
		return {
			body: JSON.stringify({
				message: 'Unauthorised',
				status: 401
			}),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 401
		};
	}

	if (!req.body) {
		return {
			body: JSON.stringify({
				message: 'Missing body',
				status: 400
			}),
			headers: { 'Content-Type': 'application/json' },
			statusCode: 400
		};
	}

	try {
		const body = JSON.parse(req.body);
		return {
			body: JSON.stringify(body),
			statusCode: 200
		};
	} catch (error) {
		return {
			body: JSON.stringify({
				message: error.toString(),
				status: 500
			}),
			statusCode: 500
		};
	}
};
