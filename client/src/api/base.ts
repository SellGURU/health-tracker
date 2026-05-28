const baseProductEndPoint =
  "https://vercel-backend-one-roan.vercel.app/holisticare";
const baseTestEndPoint =
  "https://vercel-backend-one-roan.vercel.app/holisticare_test";
const baseProductUrl = "https://holisticare.vercel.app";
const baseTestUrl = "https://holisticare-develop.vercel.app";
const localurl= 'http://127.0.0.1:3901'
let env: "test" | "production"| "local" = "production";
  
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

export { resolveBaseEndPoint, resolveBaseUrl, env };
