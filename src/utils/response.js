export function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

export function html(content, status = 200) {
    return new Response(content, {
        status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

export function redirect(url, status = 302) {
    return new Response(null, {
        status,
        headers: { 'Location': url }
    });
}

export function error(message, status = 400) {
    return json({ status: false, reason: message }, status);
}

export function sanitize(data) {
    if (typeof data !== 'string') return data;
    return data.replace(/[<>]/g, '').trim();
}