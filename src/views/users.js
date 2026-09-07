import { layout } from './layout';

export function usersView(session) {
  const content = `
    <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h1 class="text-3xl font-extrabold text-slate-800">User Management</h1>
            <p class="text-slate-500 mt-2">Manage panel users and permissions.</p>
        </div>
        
        <div class="glass-card p-6 mt-6">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left text-slate-500 text-sm">
                            <th class="pb-4">Username</th>
                            <th class="pb-4">Role</th>
                            <th class="pb-4">Balance</th>
                            <th class="pb-4">Status</th>
                            <th class="pb-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" class="text-center py-8 text-slate-400">Loading users...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `;
  
  return layout(content, session, 'users');
}
