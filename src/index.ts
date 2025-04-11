export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		
		switch (url.pathname) {
			case '/status':
				return new Response('OK');
			case '/goodThenBad': {
				const queryParams = new URLSearchParams(url.search);
				const retest = queryParams.get('retest') === 'true';
				
				const filePath = retest
					? 'missing_main_heading.html'
					: 'perfect.html';
				
				const assetUrl = new URL(filePath, url.origin);
				const assetRequest = new Request(assetUrl.toString(), request);
				
				return env.ASSETS.fetch(assetRequest);
			}
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
