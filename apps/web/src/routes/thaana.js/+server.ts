// The @yashau/thaana browser build, served from the same origin as the fonts.
import source from '@yashau/thaana/cdn?raw';

export const prerender = true;

export const GET = () => new Response(source, { headers: { 'content-type': 'text/javascript; charset=utf-8' } });
