"use server";

export async function logToServer(message: string) {
  console.log(`[Server] ${message}`);
}
