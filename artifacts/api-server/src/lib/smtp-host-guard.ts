import { promises as dns } from "node:dns";
import net from "node:net";

const PRIVATE_V4 = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGNAT 100.64/10
];

function isBlockedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    return PRIVATE_V4.some((re) => re.test(ip));
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fe80:") || lower.startsWith("fc") || lower.startsWith("fd")) return true;
    // IPv4-mapped IPv6
    const m = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (m && PRIVATE_V4.some((re) => re.test(m[1]))) return true;
  }
  return false;
}

export async function assertSafeSmtpHost(host: string): Promise<void> {
  if (!host) throw new Error("SMTP host is required");
  const lower = host.toLowerCase().trim();
  if (lower === "localhost" || lower.endsWith(".local") || lower.endsWith(".internal")) {
    throw new Error("SMTP host points to a local/internal address and is not allowed");
  }
  if (net.isIP(lower)) {
    if (isBlockedIp(lower)) {
      throw new Error("SMTP host is a private or loopback IP and is not allowed");
    }
    return;
  }
  let addrs: { address: string; family: number }[] = [];
  try {
    addrs = await dns.lookup(lower, { all: true });
  } catch {
    throw new Error("SMTP host could not be resolved");
  }
  for (const a of addrs) {
    if (isBlockedIp(a.address)) {
      throw new Error("SMTP host resolves to a private or loopback IP and is not allowed");
    }
  }
}
