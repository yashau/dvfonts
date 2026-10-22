// Default CSS for Thaana text from @yashau/thaana.
import source from '@yashau/thaana/thaana.css?raw';

export const prerender = true;

export const GET = () => new Response(source, { headers: { 'content-type': 'text/css; charset=utf-8' } });
