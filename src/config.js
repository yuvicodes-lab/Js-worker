export const config = {
    jwt: {
        secret: 'your-super-secret-key-change-this-123456789',
        expiresIn: '7d'
    },
    session: {
        cookieName: 'arc_session'
    },
    security: {
        staticWords: 'Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E',
        encSalt: 'VIPENC'
    }
};