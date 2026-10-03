import { legacyResponse } from '../src/lib/legacy';
import handler from 'vinext/server/fetch-handler';
export * from 'vinext/server/fetch-handler';

const worker = {
  ...handler,
  async fetch(request: Request, env: { SITE_MODE?: string }, context: unknown) {
    const url = new URL(request.url);
    const legacy = legacyResponse(request, env.SITE_MODE === 'production');
    if (
      env.SITE_MODE === 'production' &&
      url.hostname === 'thewhitleycaptures.com'
    ) {
      url.hostname = 'www.thewhitleycaptures.com';
      url.protocol = 'https:';
      // Old apex URLs go straight to their canonical destination in one hop.
      return legacy?.status === 301 ? legacy : Response.redirect(url.href, 301);
    }
    const response = legacy || (await handler.fetch(request, env, context));
    const headers = new Headers(response.headers);
    const path = new URL(request.url).pathname;
    const preview = env.SITE_MODE !== 'production';
    const privateRoute = /^\/(studio|api)(\/|$)/.test(path);
    const draftSession = /(?:^|;\s*)__prerender_bypass=/.test(
      request.headers.get('cookie') || '',
    );
    if (preview || privateRoute || draftSession) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      headers.set('Cache-Control', 'private, no-store');
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
