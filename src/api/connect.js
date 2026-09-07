export async function connectAPI(request, env, token) {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    // Simple MD5 implementation
    async function md5(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('MD5', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    function json(data, status = 200) {
        return new Response(JSON.stringify(data), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const formData = await request.formData();
        const game = formData.get('game') || '';
        const userKey = formData.get('user_key') || '';
        const serial = formData.get('serial') || '';
        
        if (!token || !game || !userKey || !serial) {
            return json({ status: false, reason: 'INVALID PARAMETER' });
        }
        
        if (game !== 'PUBG') {
            return json({ status: false, reason: 'USER OR GAME NOT REGISTERED' });
        }
        
        // Panel check
        const panel = await env.DB.prepare(
            'SELECT * FROM panels WHERE connect_token = ? AND is_active = 1'
        ).bind(token).first();
        
        if (!panel) {
            return json({ status: false, reason: 'USER OR GAME NOT REGISTERED' });
        }
        
        // Key check
        const keyData = await env.DB.prepare(
            'SELECT * FROM api_keys WHERE key_value = ? AND panel_code = ? AND is_active = 1'
        ).bind(userKey, panel.panel_code).first();
        
        if (!keyData) {
            return json({ status: false, reason: 'USER OR GAME NOT REGISTERED' });
        }
        
        if (keyData.is_blocked) {
            return json({ status: false, reason: 'USER BLOCKED' });
        }
        
        if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
            return json({ status: false, reason: 'EXPIRED KEY' });
        }
        
        // Device limit check
        const devices = await env.DB.prepare(
            'SELECT device_uuid FROM key_devices WHERE key_id = ?'
        ).bind(keyData.id).all();
        
        const deviceList = devices.results.map(d => d.device_uuid);
        
        if (!deviceList.includes(serial)) {
            if (deviceList.length >= keyData.device_limit) {
                return json({ status: false, reason: 'MAX DEVICE REACHED' });
            }
            
            await env.DB.prepare(
                'INSERT INTO key_devices (key_id, device_uuid, panel_code) VALUES (?, ?, ?)'
            ).bind(keyData.id, serial, panel.panel_code).run();
        } else {
            await env.DB.prepare(
                'UPDATE key_devices SET last_seen = CURRENT_TIMESTAMP WHERE key_id = ? AND device_uuid = ?'
            ).bind(keyData.id, serial).run();
        }
        
        // Update key usage
        await env.DB.prepare(
            'UPDATE api_keys SET uses = uses + 1 WHERE id = ?'
        ).bind(keyData.id).run();
        
        // Get mod settings
        const settingsData = await env.DB.prepare(
            'SELECT setting_name, setting_value FROM mod_settings WHERE panel_code = ?'
        ).bind(panel.panel_code).all();
        
        const settings = {};
        settingsData.results.forEach(s => {
            settings[s.setting_name] = s.setting_value;
        });
        
        // Generate token
        const staticWords = 'Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E';
        const real = `PUBG-${userKey}-${serial}-${staticWords}`;
        const tokenValue = await md5(real);
        const encValue = await md5(tokenValue + 'VIPENC');
        
        return json({
            status: true,
            data: {
                real: real,
                token: tokenValue,
                Enc: encValue,
                EXP: keyData.expires_at || 'N/A',
                rng: Math.floor(Date.now() / 1000),
                modname: settings.modname || 'ARC MOD',
                mod_status: settings.mod_status || 'Online',
                credit: settings.credit || 'Arc Panel',
                ESP: settings.ESP || 'on',
                Item: settings.Item || 'on',
                AIM: settings.AIM || 'on',
                SilentAim: settings.SilentAim || 'on',
                BulletTrack: settings.BulletTrack || 'on',
                Floating: settings.Floating || 'on',
                Memory: settings.Memory || 'on',
                Setting: settings.Setting || 'on',
                exdate: keyData.expires_at || 'N/A',
                device: String(keyData.device_limit)
            }
        });
        
    } catch (error) {
        return json({ status: false, reason: 'SERVER ERROR' });
    }
}
