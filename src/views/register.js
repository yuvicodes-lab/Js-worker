export function registerView() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>Register - ARC PANEL</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #F5F5F7; }
        .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-[420px] glass-card p-8 sm:p-10 rounded-[2rem]">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                <i class="bi bi-person-plus-fill"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-slate-800">Create Account</h1>
            <p class="text-sm text-slate-500 mt-1">Join ARC Panel</p>
        </div>
        <form method="POST" action="/register" class="space-y-5">
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
                <input type="text" name="username" required class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Choose username">
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <input type="password" name="password" required class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Create password">
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1.5">Panel Code</label>
                <input type="text" name="panel_code" required class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Enter panel code">
            </div>
            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl">
                Register
            </button>
        </form>
        <p class="mt-6 text-center text-sm text-slate-500">
            Already have account? <a href="/login" class="text-blue-600 font-bold">Login</a>
        </p>
    </div>
</body>
</html>`;
}
