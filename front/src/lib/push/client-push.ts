"use client";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function keysEqual(a: ArrayBuffer | null, b: Uint8Array): boolean {
  if (!a) return false;
  const viewA = new Uint8Array(a);
  if (viewA.byteLength !== b.byteLength) return false;
  for (let i = 0; i < viewA.byteLength; i++) {
    if (viewA[i] !== b[i]) return false;
  }
  return true;
}

export function isEmbeddedInIframe(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

async function waitForDocumentReady(): Promise<void> {
  if (typeof document === "undefined" || document.readyState === "complete") {
    return;
  }
  await new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, 2500);
    window.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}

async function waitForActivatedWorker(
  reg: ServiceWorkerRegistration
): Promise<ServiceWorkerRegistration> {
  if (reg.active) return reg;

  const worker = reg.installing || reg.waiting;
  if (worker) {
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 4000);
      const onStateChange = () => {
        if (worker.state === "activated" || worker.state === "redundant") {
          window.clearTimeout(timer);
          worker.removeEventListener("statechange", onStateChange);
          resolve();
        }
      };
      worker.addEventListener("statechange", onStateChange);
    });
  }

  return reg;
}

async function ensureServiceWorkerReady(): Promise<ServiceWorkerRegistration> {
  await waitForDocumentReady();

  let registration: ServiceWorkerRegistration | undefined;

  try {
    registration = await navigator.serviceWorker.getRegistration("/");
  } catch {
    // Fallback to register below
  }

  if (!registration) {
    registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  } else {
    void registration.update().catch(() => {});
  }

  await waitForActivatedWorker(registration);

  if (registration.active) {
    return registration;
  }

  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_, reject) =>
      window.setTimeout(
        () => reject(new Error("Timed out waiting for Service Worker to activate.")),
        5000
      )
    ),
  ]);
}

function formatPushError(err: unknown): string {
  const rawMsg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : "";

  if (
    name === "InvalidStateError" ||
    rawMsg.toLowerCase().includes("invalid state") ||
    rawMsg.toLowerCase().includes("serviceworkerregistration")
  ) {
    if (isEmbeddedInIframe()) {
      return "Background Push cannot register inside an embedded preview iframe. Open the Admin page directly in a new browser tab to enable Push.";
    }
    return "Browser Service Worker could not register in the current document state. Refresh the page or open in a standard browser tab (not private/incognito).";
  }

  return rawMsg || "Failed to register push notifications.";
}

export async function subscribeAndSyncAdminPush(options?: {
  requestPermission?: boolean;
}): Promise<{
  ok: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  activeSubscriptionsCount?: number;
  supabasePersisted?: boolean;
  inIframe?: boolean;
  error?: string;
}> {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return {
      ok: false,
      permission: "default",
      subscribed: false,
      inIframe: isEmbeddedInIframe(),
      error: "Push notifications are not supported on this browser/device.",
    };
  }

  let permission: NotificationPermission = Notification.permission;

  if (permission === "denied") {
    return {
      ok: false,
      permission,
      subscribed: false,
      inIframe: isEmbeddedInIframe(),
      error:
        "Notifications are blocked in your browser site permissions. Please allow them in your browser settings.",
    };
  }

  if (permission !== "granted") {
    if (!options?.requestPermission) {
      return {
        ok: false,
        permission,
        subscribed: false,
        inIframe: isEmbeddedInIframe(),
      };
    }
    try {
      permission = await Notification.requestPermission();
    } catch (err) {
      return {
        ok: false,
        permission,
        subscribed: false,
        inIframe: isEmbeddedInIframe(),
        error: formatPushError(err),
      };
    }
    if (permission !== "granted") {
      return {
        ok: false,
        permission,
        subscribed: false,
        inIframe: isEmbeddedInIframe(),
        error: "Notification permission was not granted.",
      };
    }
  }

  try {
    const reg = await ensureServiceWorkerReady();

    const keyRes = await fetch("/api/admin/push/subscribe", { cache: "no-store" });
    if (!keyRes.ok) {
      return {
        ok: false,
        permission,
        subscribed: false,
        error: "Failed to retrieve VAPID public key from server.",
      };
    }
    const keyData = (await keyRes.json()) as { publicKey?: string };
    const publicKey = keyData.publicKey;
    if (!publicKey) {
      return {
        ok: false,
        permission,
        subscribed: false,
        error: "Server VAPID public key is missing.",
      };
    }

    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    let subscription = await reg.pushManager.getSubscription();

    // If browser already has a subscription with an old/mismatched VAPID key, replace it
    if (
      subscription &&
      !keysEqual(subscription.options?.applicationServerKey ?? null, applicationServerKey)
    ) {
      try {
        await subscription.unsubscribe();
      } catch {
        // Continue to re-subscribe
      }
      subscription = null;
    }

    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    const saveRes = await fetch("/api/admin/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    });

    if (!saveRes.ok) {
      const errBody = await saveRes.json().catch(() => ({}));
      return {
        ok: false,
        permission,
        subscribed: false,
        error: errBody.error || "Failed to register device subscription on server.",
      };
    }

    const saveData = (await saveRes.json()) as {
      activeSubscriptionsCount?: number;
      supabasePersisted?: boolean;
    };

    return {
      ok: true,
      permission,
      subscribed: true,
      activeSubscriptionsCount: saveData.activeSubscriptionsCount,
      supabasePersisted: saveData.supabasePersisted,
    };
  } catch (err) {
    return {
      ok: false,
      permission,
      subscribed: false,
      inIframe: isEmbeddedInIframe(),
      error: formatPushError(err),
    };
  }
}
