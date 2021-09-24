const fetch = import('node-fetch');
const {
	DISCORD_WEBHOOK,
	INCOMING_KEY
} = process.env;

const red = 15158588;
const green = 900864;

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
		const online = body.response_summary === 'Available';

		const response = await fetch(DISCORD_WEBHOOK, {
			body: JSON.stringify({
				embeds: [
					{
						color: online ? green : red,
						description: `[${body.check_name}](${body.check_url}) responded with a status code of **${body.response_status_code}** in ${body.response_time || '0'}ms.`,
						fields: [
							{
								inline: true,
								name: 'Visit the status page at',
								value: '[status.christmascountdown.live](https://status.christmascountdown.live)'
							}
						],
						timestamp: body.request_datetime,
						title: `${online ? '✅' : '❌'} ${body.check_name} is ${online ? 'online' : 'down'}`,
						url: 'https://status.christmascountdown.live'
					}
				]
			}),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST'
		});

		if (response.ok) {
			return {
				body: JSON.stringify({
					message: 'OK',
					status: 500
				}),
				statusCode: 200
			};
		} else {
			return {
				body: JSON.stringify({
					message: 'Discord webhook request failed',
					status: 500
				}),
				statusCode: 500
			};
		}

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
