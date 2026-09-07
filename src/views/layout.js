export function layout(content, session = null, activeRoute = '') {
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
        .btn-blue { background: #007AFF; color: white; box-shadow: 0 4px 14px rgba(0,122,255,0.3); }
    </style>
</head>
<body class="text-slate-800">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-slate-200 p-4">
            <div class="p-4">
                <h1 class="text-xl font-bold">${displayName}</h1>
            </div>
            <nav class="space-y-1">
                <a href="/dashboard" class="block px-4 py-2 rounded-lg hover:bg-blue-50 text-slate-700 font-medium">
                    <i class="bi bi-grid-1x2-fill mr-2"></i> Dashboard
                </a>
                <!-- More nav items here -->
            </nav>
        </aside>
        
        <!-- Main Content -->
        <div class="flex-1 overflow-auto">
            <header class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div>
                    <span class="text-sm text-slate-500">Panel Code:</span>
                    <span class="font-bold text-blue-600 ml-2">${session?.panel_code || ''}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-sm">${username}</span>
                    <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        ${avatarLetter}
                    </div>
                    <a href="/logout" class="text-slate-400 hover:text-red-500"><i class="bi bi-box-arrow-right"></i></a>
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