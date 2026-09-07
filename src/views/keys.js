import { layout } from './layout';

export function keysView(session) {
  const content = `
    <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h1 class="text-3xl font-extrabold text-slate-800">Key Manager</h1>
            <p class="text-slate-500 mt-2">View and manage your generated keys.</p>
        </div>
        
        <div class="glass-card p-6 mt-6">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left text-slate-500 text-sm">
                            <th class="pb-4">Key</th>
                            <th class="pb-4">Duration</th>
                            <th class="pb-4">Status</th>
                            <th class="pb-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="keys-table">
                        <tr>
                            <td colspan="4" class="text-center py-8 text-slate-400">Loading keys...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `;
  
  return layout(content, session, 'keys');
}
