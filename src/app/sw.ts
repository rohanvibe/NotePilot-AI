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

// Periodic Background Sync implementation
self.addEventListener("periodicsync", (event: any) => {
    if (event.tag === "sync-notes") {
        event.waitUntil(
            fetch("/api/sync-check")
                .then((response) => response.json())
                .then((data) => {
                    console.log("Periodic sync successful:", data);
                })
                .catch((err) => console.error("Periodic sync failed:", err))
        );
    }
});

// Push Notifications implementation
self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : { title: "AI Notes", body: "Check your new note analysis!" };
    const options = {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        data: {
            url: data.url || "/",
        },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.openWindow(event.notification.data.url)
    );
});

serwist.addEventListeners();
