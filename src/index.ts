// Create a Map to track visits to the goodThenBad route
const visitCounts = new Map<string, number>();

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		
		switch (url.pathname) {
			case '/status':
				return new Response('OK');
			case '/goodThenBad': {
				const visitorId = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
				
				const visitCount = visitCounts.get(visitorId) || 0;
				
				visitCounts.set(visitorId, visitCount + 1);
				
				const filePath = visitCount === 0 
					? 'perfect.html'
					: 'missing_main_heading.html';
				
				const assetUrl = new URL(filePath, url.origin);
				const assetRequest = new Request(assetUrl.toString(), request);
				
				return env.ASSETS.fetch(assetRequest);
			}
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
