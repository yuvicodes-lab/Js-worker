export async function getUserById(db, userId) {
    return await db.prepare(
        'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first();
}

export async function getUserByUsername(db, username) {
    return await db.prepare(
        'SELECT * FROM users WHERE username = ?'
    ).bind(username).first();
}

export async function getPanelByCode(db, panelCode) {
    return await db.prepare(
        'SELECT * FROM panels WHERE panel_code = ?'
    ).bind(panelCode).first();
}

export async function getModSettings(db, panelCode) {
    const settings = await db.prepare(
        'SELECT setting_name, setting_value FROM mod_settings WHERE panel_code = ?'
    ).bind(panelCode).all();
    
    return settings.results.reduce((acc, s) => {
        acc[s.setting_name] = s.setting_value;
        return acc;
    }, {});
}

export async function getDashboardStats(db, userId, role, panelCode) {
    if (role === 'OWNER') {
        const stats = await db.batch([
            db.prepare('SELECT COUNT(*) as count FROM users WHERE panel_code = ? AND role = ?').bind(panelCode, 'ADMIN'),
            db.prepare('SELECT COUNT(*) as count FROM users WHERE panel_code = ? AND role = ?').bind(panelCode, 'RESELLER'),
            db.prepare('SELECT COUNT(*) as count FROM api_keys WHERE panel_code = ?').bind(panelCode),
        ]);
        
        return {
            total_admins: stats[0].results[0].count,
            total_resellers: stats[1].results[0].count,
            total_keys: stats[2].results[0].count
        };
    }
    
    // For ADMIN and RESELLER
    const stats = await db.prepare(
        'SELECT COUNT(*) as count FROM api_keys WHERE panel_code = ? AND created_by = ?'
    ).bind(panelCode, userId).first();
    
    return { my_keys: stats.count };
}