import { layout } from './layout';

export function loginView(error = null) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Login - ARC PANEL</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                <i class="bi bi-shield-lock-fill"></i>
            </div>
            <h1 class="text-2xl font-bold">ARC PANEL</h1>
        </div>
        ${error ? `<div class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">${error}</div>` : ''}
        <form method="POST" action="/login" class="space-y-4">
            <input type="text" name="username" placeholder="Username" required class="w-full px-4 py-3 border border-slate-200 rounded-lg">
            <input type="password" name="password" placeholder="Password" required class="w-full px-4 py-3 border border-slate-200 rounded-lg">
            <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600">
                Sign In
            </button>
        </form>
    </div>
</body>
</html>`;
}

export async function loginHandler(request, env) {
    const formData = await request.formData();
    const username = sanitize(formData.get('username') || '');
    const password = formData.get('password') || '';
    
    const user = await env.DB.prepare(
        'SELECT * FROM users WHERE username = ? AND is_blocked = 0'
    ).bind(username).first();
    
    if (user && password === user.password) { // Yahan bcrypt use karna hoga
        const token = await generateToken({
            user_id: user.id,
            username: user.username,
            role: user.role,
            panel_code: user.panel_code
        });
        
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/dashboard',
                'Set-Cookie': createSessionCookie(token)
            }
        });
    }
    
    return html(loginView('Invalid username or password'), 401);
}