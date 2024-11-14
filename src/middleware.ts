import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

const notAuthenticatedRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, locals, redirect, request }, next) => {
    const user = await getSession(request);
    const isLoggedIn = !!user;

    // TODO:
    locals.isLoggedIn = isLoggedIn;
    locals.isAdmin = false;

    if (user) {
      // TODO:
      locals.user = {
        email: user?.user?.email ?? '',
        name: user?.user?.name ?? '',
      };

      locals.isAdmin = user?.user?.role === 'admin';
    }

    // TODO: Eventualmente tenemos que controlar el acceso por roles
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
