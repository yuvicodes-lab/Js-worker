import { verifyToken, generateToken } from './utils/security';
import { config } from './config';

export async function getSession(request) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const token = cookies[config.session.cookieName];
    
    if (!token) return null;
    
    const payload = await verifyToken(token);
    return payload;
}

export function parseCookies(cookieHeader) {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name) cookies[name] = rest.join('=');
    });
    return cookies;
}

export function createSessionCookie(token) {
    return `${config.session.cookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`;
}

export function destroySessionCookie() {
    return `${config.session.cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export async function requireLogin(request) {
    const session = await getSession(request);
    if (!session) {
        return { redirect: '/login' };
    }
    return { session };
}

export async function requireRole(request, roles) {
    const { session, redirect } = await requireLogin(request);
    if (redirect) return { redirect };
    
    if (!roles.includes(session.role)) {
        return { error: 'Access Denied', status: 403 };
    }
    
    return { session };
}