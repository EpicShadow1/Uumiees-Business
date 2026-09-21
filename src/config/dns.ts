export class DNSConfig {
  static validateDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  static getLocalDNS(): string {
    return process.env.DNS_SERVER || '8.8.8.8'; // Google DNS
  }
}
