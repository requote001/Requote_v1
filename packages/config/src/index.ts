export type RuntimeEnvironment = "development" | "staging" | "production";

export type RequoteConfig = {
  nodeEnv: RuntimeEnvironment;
  port: number;
  webOrigin: string;
  databaseUrl: string;
  redisUrl: string;
};

export function requireEnvironment(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
