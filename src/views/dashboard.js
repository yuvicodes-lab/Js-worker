import { layout } from './layout';

export function dashboardView(user, stats) {
    const content = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-card p-6">
                <p class="text-sm text-slate-500">Account Balance</p>
                <h3 class="text-3xl font-bold">${user.balance || 'UNLIMITED'}</h3>
            </div>
            <div class="glass-card p-6">
                <p class="text-sm text-slate-500">Total Keys</p>
                <h3 class="text-3xl font-bold">${stats.total_keys || stats.my_keys || 0}</h3>
            </div>
            <div class="glass-card p-6">
                <p class="text-sm text-slate-500">Role</p>
                <h3 class="text-3xl font-bold text-blue-600">${user.role}</h3>
            </div>
        </div>
        
        <div class="glass-card p-6">
            <h2 class="text-xl font-bold mb-4">API Integration</h2>
            <div class="bg-slate-900 p-4 rounded-lg font-mono text-sm">
                <p class="text-slate-400 mb-2">// Connect Endpoint</p>
                <p class="text-emerald-400">POST http://your-worker.workers.dev/connect/${user.panel_code}</p>
            </div>
        </div>
    `;
    
    return layout(content, user, 'dashboard');
}