import { layout } from './layout';

export function generateView(session) {
  const content = `
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h1 class="text-3xl font-extrabold text-slate-800">Generate Keys</h1>
            <p class="text-slate-500 mt-2">Create new premium keys for your users.</p>
        </div>
        
        <div class="glass-card p-8 mt-6">
            <form method="POST" action="/generate" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                        <select name="duration" class="w-full px-4 py-3 border border-slate-200 rounded-xl">
                            <option value="1D">1 Day</option>
                            <option value="7D">7 Days</option>
                            <option value="30D">30 Days</option>
                            <option value="90D">90 Days</option>
                            <option value="365D">365 Days</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Device Limit</label>
                        <input type="number" name="device_limit" value="1" min="1" max="10" class="w-full px-4 py-3 border border-slate-200 rounded-xl">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Number of Keys</label>
                    <input type="number" name="quantity" value="1" min="1" max="100" class="w-full px-4 py-3 border border-slate-200 rounded-xl">
                </div>
                <button type="submit" class="w-full btn-blue font-bold py-4 rounded-xl">
                    <i class="bi bi-key-fill mr-2"></i> Generate Keys
                </button>
            </form>
        </div>
    </div>
  `;
  
  return layout(content, session, 'generate');
}
