const APPS = {
  agent: "https://security-app-agent.pages.dev",
  manager: "https://security-app-manager.pages.dev"
};

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const match = /^\/sabsecurity\/(agent|manager)(?:\/(.*))?$/.exec(url.pathname);

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const [, app, path] = match;
  if (path === undefined) {
    url.pathname += "/";
    return Response.redirect(url, 308);
  }

  const upstream = new URL(APPS[app]);
  upstream.pathname = app === "manager" && path === "" ? "/manager" : `/${path}`;
  upstream.search = url.search;

  const response = await fetch(new Request(upstream, request), { redirect: "manual" });
  const location = response.headers.get("Location");
  if (!location) {
    return response;
  }

  const redirect = new URL(location, upstream);
  if (redirect.origin !== upstream.origin) {
    return response;
  }

  redirect.protocol = url.protocol;
  redirect.host = url.host;
  redirect.pathname = `/sabsecurity/${app}${redirect.pathname}`;
  const headers = new Headers(response.headers);
  headers.set("Location", redirect.href);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
