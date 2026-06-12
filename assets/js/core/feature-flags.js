export const featureFlags = {
  beta: false
};

export function loadFeatureFlags() {
  const hash = location.hash;
  featureFlags.beta = hash.includes("beta");
}
