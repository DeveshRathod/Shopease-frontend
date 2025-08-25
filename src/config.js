export async function getRuntimeConfig() {
  const res = await fetch("/config.json");
  return await res.json();
}
