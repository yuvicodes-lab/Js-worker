import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config';

const encoder = new TextEncoder();

export async function generateToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(config.jwt.expiresIn)
        .sign(encoder.encode(config.jwt.secret));
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(
            token,
            encoder.encode(config.jwt.secret)
        );
        return payload;
    } catch {
        return null;
    }
}

export function generateMD5(text) {
    // Simple MD5 implementation for Workers (aap crypto.subtle use kar sakte ho)
    return crypto.subtle.digest('MD5', encoder.encode(text))
        .then(buffer => Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(''));
}

export function generateCSRFToken() {
    return crypto.randomUUID();
}