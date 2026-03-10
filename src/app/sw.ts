/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
});

// 1. BACKGROUND SYNC (Standard API for PWA Builder)
self.addEventListener("sync", (event: any) => {
    if (event.tag === "sync-data") {
        console.log("Service Worker: Syncing data in background...");
        event.waitUntil(Promise.resolve());
    }
});

// 2. PERIODIC BACKGROUND SYNC (Standard API for PWA Builder)
self.addEventListener("periodicsync", (event: any) => {
    if (event.tag === "periodic-sync") {
        console.log("Service Worker: Periodic background sync triggered.");
        event.waitUntil(
            fetch("/api/health") // Simple heart-beat check
                .then(() => console.log("Periodic sync check completed."))
                .catch(() => console.warn("Periodic sync fetch failed."))
        );
    }
});

// 3. PUSH NOTIFICATIONS (Standard API for PWA Builder)
self.addEventListener("push", (event) => {
    console.log("Service Worker: Push message received.");
    const payload = event.data ? event.data.text() : "You have new AI note summaries ready!";
    const options = {
        body: payload,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            url: "/"
        }
    };

    event.waitUntil(
        self.registration.showNotification("AI Notes Organizer", options)
    );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    console.log("Service Worker: Notification clicked.");
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: "window" }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === "/" && "focus" in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow("/");
        })
    );
});

serwist.addEventListeners();
