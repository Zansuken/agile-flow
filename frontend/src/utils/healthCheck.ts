// Health check utility for frontend
export const checkBackendHealth = async (
  baseUrl: string = window.location.origin,
): Promise<boolean> => {
  try {
    // First check basic health
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const healthResponse = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!healthResponse.ok) {
      return false;
    }

    const healthData = await healthResponse.json();

    // Check if backend is ready (not just running)
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 5000);

    const readyResponse = await fetch(`${baseUrl}/api/ready`, {
      method: 'GET',
      signal: controller2.signal,
    });

    clearTimeout(timeoutId2);

    if (!readyResponse.ok) {
      return false;
    }

    const readyData = await readyResponse.json();

    return healthData.status === 'ok' && readyData.status === 'ready';
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

export const waitForBackendReady = async (
  baseUrl: string = window.location.origin,
  maxWaitMs: number = 60000,
  pollIntervalMs: number = 2000,
): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    if (await checkBackendHealth(baseUrl)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return false;
};
