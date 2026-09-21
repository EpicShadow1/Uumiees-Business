// Proxy configurtion ( for outgoing requests)
export const proxyConfig = {
    forwardProxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY,
    
    //Trust proxies (for reverse proxy setups)
    trustProxy: process.env.TRUST_PROXY === 'true',
    
    //Allowed proxy IPs
    allowedProxies: process.env.ALLOWED_PROXIES?.split(',') || []
};