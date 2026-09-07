export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    function json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    function html(content, status = 200) {
      return new Response(content, {
        status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    function redirect(url, status = 302) {
      return new Response(null, {
        status,
        headers: { 'Location': url }
      });
    }
    
    function getCookies(request) {
      const cookieHeader = request.headers.get('Cookie') || '';
      const cookies = {};
      cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name) cookies[name] = rest.join('=');
      });
      return cookies;
    }
    
    function sanitize(data) {
      if (typeof data !== 'string') return data;
      return data.replace(/[<>]/g, '').trim();
    }
    
    // Simple token functions
    const JWT_SECRET = 'arc-panel-secret-key-2024';
    
    function generateToken(payload) {
      const header = { alg: 'HS256', typ: 'JWT' };
      const now = Math.floor(Date.now() / 1000);
      const tokenPayload = {
        ...payload,
        exp: now + (7 * 24 * 60 * 60)
      };
      
      const encodedHeader = btoa(JSON.stringify(header));
      const encodedPayload = btoa(JSON.stringify(tokenPayload));
      const signature = btoa(JWT_SECRET + encodedHeader + encodedPayload);
      
      return `${encodedHeader}.${encodedPayload}.${signature}`;
    }
    
    function verifyToken(token) {
      try {
        const [header, payload, signature] = token.split('.');
        const expectedSignature = btoa(JWT_SECRET + header + payload);
        
        if (signature !== expectedSignature) return null;
        
        const decodedPayload = JSON.parse(atob(payload));
        if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;
        
        return decodedPayload;
      } catch {
        return null;
      }
    }
    
    // Login page
    function loginView(error = null) {
      return `<!DOCTYPE html>
<html>
<head>
    <title>Login - ARC PANEL</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #F5F5F7; }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); }
        .input-apple { background: rgba(245, 245, 247, 0.8); border: 1px solid rgba(0,0,0,0.05); transition: all 0.2s ease; }
        .input-apple:focus { background: #fff; border-color: #007AFF; box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1); outline: none; }
        .btn-blue { background: #007AFF; color: white; transition: all 0.3s ease; box-shadow: 0 4px 14px rgba(0, 122, 255, 0.3); }
        .btn-blue:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4); }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-[420px] glass-card p-8 sm:p-10 rounded-[2rem]">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                <i class="bi bi-shield-lock-fill"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-slate-800">ARC PANEL</h1>
            <p class="text-sm text-slate-500 mt-1">Sign in to your workspace</p>
        </div>
        ${error ? `<div class="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold">${error}</div>` : ''}
        <form method="POST" action="/login" class="space-y-5">
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
                <input type="text" name="username" required class="w-full input-apple px-4 py-3.5 rounded-xl font-medium" placeholder="Enter your username">
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <input type="password" name="password" required class="w-full input-apple px-4 py-3.5 rounded-xl font-medium" placeholder="Enter your password">
            </div>
            <button type="submit" class="w-full btn-blue font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                Continue <i class="bi bi-arrow-right"></i>
            </button>
        </form>
    </div>
</body>
</html>`;
    }
    
    // Dashboard page
    function layout(content, session = null, activeRoute = '') {
      const displayName = 'ARC PANEL';
      const username = session?.username || 'Guest';
      const role = session?.role || 'GUEST';
      const avatarLetter = username.charAt(0).toUpperCase();
      
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} - Premium Auth</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { background: #f8fafc; }
        .glass-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    </style>
</head>
<body class="text-slate-800">
    <div class="flex h-screen">
        <aside class="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">
            <div class="p-4 border-b border-slate-200">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                        <i class="bi bi-shield-check"></i>
                    </div>
                    ${displayName}
                </h1>
            </div>
            <nav class="mt-4 space-y-1 flex-1">
                <a href="/dashboard" class="flex items-center gap-3 px-4 py-2.5 rounded-lg ${activeRoute === 'dashboard' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-blue-50'} font-medium">
                    <i class="bi bi-grid-1x2-fill"></i> Dashboard
                </a>
                <a href="/generate" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 font-medium">
                    <i class="bi bi-key-fill"></i> Generate Keys
                </a>
                <a href="/keys" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 font-medium">
                    <i class="bi bi-view-list"></i> Key Manager
                </a>
                ${session?.role === 'OWNER' || session?.role === 'ADMIN' ? `
                <a href="/users" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-blue-50 font-medium">
                    <i class="bi bi-people-fill"></i> Users
                </a>
                ` : ''}
            </nav>
            <div class="border-t border-slate-200 pt-4">
                <a href="/logout" class="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium">
                    <i class="bi bi-box-arrow-right"></i> Sign Out
                </a>
            </div>
        </aside>
        
        <div class="flex-1 overflow-auto">
            <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div>
                    <span class="text-sm text-slate-500">Panel Code:</span>
                    <span class="font-bold text-blue-600 ml-2">${session?.panel_code || ''}</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <div class="text-sm font-bold">${username}</div>
                        <div class="text-xs text-slate-500">${role}</div>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        ${avatarLetter}
                    </div>
                </div>
            </header>
            <main class="p-6">
                ${content}
            </main>
        </div>
    </div>
</body>
</html>`;
    }
    
    // Dashboard content
    async function dashboardView(env, session) {
      try {
        const user = await env.DB.prepare(
          'SELECT * FROM users WHERE id = ?'
        ).bind(session.user_id).first();
        
        if (!user) {
          return html('User not found', 404);
        }
        
        const totalKeys = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM api_keys WHERE panel_code = ?'
        ).bind(user.panel_code).first();
        
        const content = `
          <div class="max-w-7xl mx-auto space-y-8">
            <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h1 class="text-3xl font-extrabold">Welcome back, ${user.username}! 👋</h1>
              <p class="text-slate-500 mt-2">Manage your panel securely.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="glass-card p-6">
                <p class="text-slate-400 text-xs font-bold uppercase">Balance</p>
                <h3 class="text-3xl font-black mt-2">${user.balance || 'UNLIMITED'}</h3>
              </div>
              <div class="glass-card p-6">
                <p class="text-slate-400 text-xs font-bold uppercase">Total Keys</p>
                <h3 class="text-3xl font-black mt-2">${totalKeys.count || 0}</h3>
              </div>
              <div class="glass-card p-6">
                <p class="text-slate-400 text-xs font-bold uppercase">Role</p>
                <h3 class="text-3xl font-black mt-2 text-blue-600">${user.role}</h3>
              </div>
            </div>
            
            <div class="glass-card p-6">
              <h2 class="text-xl font-bold mb-4">API Integration</h2>
              <div class="bg-slate-900 p-4 rounded-lg font-mono text-sm">
                <p class="text-slate-400 mb-2">// Connect Endpoint</p>
                <p class="text-emerald-400">POST /connect/${user.panel_code}</p>
              </div>
            </div>
          </div>
        `;
        
        return layout(content, user, 'dashboard');
      } catch (error) {
        return html(`Error: ${error.message}`, 500);
      }
    }
    
    // Handle login page
    if (path === '/login') {
      if (request.method === 'POST') {
        try {
          const formData = await request.formData();
          const username = sanitize(formData.get('username') || '');
          const password = formData.get('password') || '';
          
          const user = await env.DB.prepare(
            'SELECT * FROM users WHERE username = ? AND is_blocked = 0'
          ).bind(username).first();
          
          if (user && password === user.password) {
            const token = generateToken({
              user_id: user.id,
              username: user.username,
              role: user.role,
              panel_code: user.panel_code
            });
            
            return new Response(null, {
              status: 302,
              headers: {
                'Location': '/dashboard',
                'Set-Cookie': `arc_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
              }
            });
          }
          
          return html(loginView('Invalid username or password'), 401);
        } catch (error) {
          return html(loginView('Error: ' + error.message), 500);
        }
      }
      
      return html(loginView());
    }
    
    // Handle logout
    if (path === '/logout') {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/login',
          'Set-Cookie': 'arc_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
        }
      });
    }
    
    // Protected routes
    const cookies = getCookies(request);
    const sessionToken = cookies['arc_session'];
    const session = sessionToken ? verifyToken(sessionToken) : null;
    
    if (!session) {
      return redirect('/login');
    }
    
    // Dashboard
    if (path === '/' || path === '/dashboard') {
      return html(await dashboardView(env, session));
    }
    
    // Default response
    return html('Page not found', 404);
  }
};
