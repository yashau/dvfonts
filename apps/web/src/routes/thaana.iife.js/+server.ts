// Classic-script build of @yashau/thaana: window.Thaana + auto-attach.
import source from '@yashau/thaana/iife?raw';

export const prerender = true;

export const GET = () => new Response(source, { headers: { 'content-type': 'text/javascript; charset=utf-8' } });
