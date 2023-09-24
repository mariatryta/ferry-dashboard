import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Relative path /api/${path}
 * @param path
 * @param method
 * @returns
 */

type MethodTypes = "POST" | "GET" | "DELETE";

export async function apiRequest(
  path: string,
  method: MethodTypes,
  body?: BodyInit
) {
  const response = await fetch(`/api/${path}`, { method, body: body || null });
  const data =  response.headers.get("content-type") === null ? response: await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Network response was not ok");
  } else {
    return data;
  }
}
