const baseProductEndPoint = "https://vercel-backend-one-roan.vercel.app/holisticare";
const baseTestEndPoint = "https://vercel-backend-one-roan.vercel.app/holisticare_test";
const baseProductUrl = 'https://holisticare.vercel.app'
const baseTestUrl = 'https://holisticare-develop.vercel.app'
const localurl= 'http://127.0.0.1:3901'
let  env: 'test' | 'production' | 'local' = 'local';

const resolveBaseEndPoint = () => {
  if (env == "local") {
    return localurl;
  }
  if (env == "test") {
    return baseTestEndPoint;
  }
  return baseProductEndPoint;
};
const resolveBaseUrl = () => {
  if (env === "test") {
    return baseTestUrl;
  }
  return baseProductUrl;
};

// Rook: use proxy (no credentials on client) when set; otherwise use env credentials
const getRookProxyBase = (): string | undefined =>
  (import.meta as any).env?.VITE_ROOK_PROXY_BASE?.trim() || undefined;

const getRookCredentials = (): { clientUUID: string; password: string } | undefined => {
  const clientUUID = (import.meta as any).env?.VITE_ROOK_CLIENT_UUID?.trim();
  const password = (import.meta as any).env?.VITE_ROOK_PASSWORD?.trim();
  if (clientUUID && password) return { clientUUID, password };
  return undefined;
};

export { resolveBaseEndPoint, resolveBaseUrl, env, getRookProxyBase, getRookCredentials };
