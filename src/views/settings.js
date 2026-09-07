import { layout } from './layout';

export function settingsView(session) {
  const content = `
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h1 class="text-3xl font-extrabold text-slate-800">Settings</h1>
            <p class="text-slate-500 mt-2">Configure your panel preferences.</p>
        </div>
        
        <div class="glass-card p-8 mt-6 space-y-6">
            <div>
                <h3 class="font-bold text-lg mb-4">Profile Information</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Username</label>
                        <input type="text" value="${session?.username || ''}" disabled class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Role</label>
                        <input type="text" value="${session?.role || ''}" disabled class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                    </div>
                </div>
            </div>
            
            <div class="border-t border-slate-200 pt-6">
                <h3 class="font-bold text-lg mb-4">Change Password</h3>
                <form method="POST" action="/settings" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input type="password" name="new_password" required class="w-full px-4 py-3 border border-slate-200 rounded-xl">
                    </div>
                    <button type="submit" class="btn-blue font-bold py-3 px-6 rounded-xl">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    </div>
  `;
  
  return layout(content, session, 'settings');
}
