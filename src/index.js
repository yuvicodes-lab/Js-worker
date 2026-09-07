import { getSession } from './auth';
import { json, html, redirect } from './utils/response';
import { sanitize } from './utils/response';
import { config } from './config';

// Import Views
import { loginView, loginHandler } from './views/login';
import { registerView } from './views/register';
import { dashboardView } from './views/dashboard';
import { connectAPI } from './api/connect';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // API Routes
        if (path.startsWith('/connect/')) {
            const token = path.split('/')[2];
            return await connectAPI(request, env, token);
        }

        // Web Routes
        const session = await getSession(request);
        
        // Public routes
        if (path === '/login') {
            if (request.method === 'POST') {
                return await loginHandler(request, env);
            }
            return html(loginView());
        }
        
        if (path === '/register') {
            return html(registerView());
        }

        // Protected routes
        if (!session) {
            return redirect('/login');
        }

        // Route Map - YAHAN NAYE ROUTES ADD KARO
        const routes = {
            '/': { view: dashboardView, roles: ['OWNER', 'ADMIN', 'RESELLER'] },
            '/dashboard': { view: dashboardView, roles: ['OWNER', 'ADMIN', 'RESELLER'] },
            // Yahan aur routes add karo:
            // '/generate': { view: generateView, roles: ['OWNER', 'ADMIN', 'RESELLER'] },
            // '/keys': { view: keysView, roles: ['OWNER', 'ADMIN', 'RESELLER'] },
        };

        const route = routes[path];
        
        if (route) {
            if (!route.roles.includes(session.role)) {
                return html('<h1>Access Denied</h1>', 403);
            }
            
            const user = await env.DB.prepare(
                'SELECT * FROM users WHERE id = ?'
            ).bind(session.user_id).first();
            
            if (!user || user.is_blocked) {
                return redirect('/login?blocked=1');
            }
            
            const stats = await getDashboardStats(env.DB, user.id, user.role, user.panel_code);
            return html(route.view(user, stats));
        }

        // 404
        return html('<h1 style="text-align:center; margin-top:50px;">404 - Page Not Found</h1>', 404);
    }
};