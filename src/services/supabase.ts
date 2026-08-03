import { createClient } from "@supabase/supabase-js";
import type { SupportedStorage } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigurationError =
  !supabaseUrl || !supabaseAnonKey
    ? "Supabase ยังไม่ได้ตั้งค่า: ต้องกำหนด VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY"
    : null;

const REMEMBER_COOKIE = "cris_auth_remember";
const AUTH_DB = "cris-auth";
const AUTH_STORE = "sessions";

function shouldRemember(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((value) => value.trim() === `${REMEMBER_COOKIE}=1`);
}

export function setAuthPersistence(remember: boolean) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = remember
    ? `${REMEMBER_COOKIE}=1; Path=/; Max-Age=2592000; SameSite=Strict${secure}`
    : `${REMEMBER_COOKIE}=; Path=/; Max-Age=0; SameSite=Strict${secure}`;
}

function openAuthDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(AUTH_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(AUTH_STORE)) {
        request.result.createObjectStore(AUTH_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readPersistentSession(key: string): Promise<string | null> {
  if (typeof indexedDB === "undefined") return null;
  const database = await openAuthDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(AUTH_STORE).objectStore(AUTH_STORE).get(key);
    request.onsuccess = () => resolve((request.result as string | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

async function writePersistentSession(key: string, value: string): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const database = await openAuthDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(AUTH_STORE, "readwrite")
      .objectStore(AUTH_STORE)
      .put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function removePersistentSession(key: string): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const database = await openAuthDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(AUTH_STORE, "readwrite")
      .objectStore(AUTH_STORE)
      .delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

const authStorage: SupportedStorage = {
  async getItem(key) {
    if (typeof window === "undefined") return null;
    return shouldRemember()
      ? readPersistentSession(key)
      : window.sessionStorage.getItem(key);
  },
  async setItem(key, value) {
    if (typeof window === "undefined") return;
    if (shouldRemember()) {
      window.sessionStorage.removeItem(key);
      await writePersistentSession(key, value);
    } else {
      await removePersistentSession(key);
      window.sessionStorage.setItem(key, value);
    }
  },
  async removeItem(key) {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(key);
    await removePersistentSession(key);
  },
};

export const supabase = createClient(
  supabaseUrl ?? "http://127.0.0.1:54321",
  supabaseAnonKey ?? "missing-supabase-anon-key",
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storage: authStorage,
    },
  },
);
