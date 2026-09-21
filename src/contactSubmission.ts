export async function submitContact(form: HTMLFormElement, signal: AbortSignal) {
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
    throw new Error('LOCAL_PREVIEW');
  }
  const fields = new FormData(form);
  const body = new URLSearchParams();
  for (const [key, value] of fields.entries()) {
    if (typeof value === 'string') body.append(key, value.trim());
  }
  const response = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    signal,
  });
  if (!response.ok) throw new Error('Message refused');
  const result = await response.text();
  if (result.includes('/@vite/client') || /id=["']root["']/.test(result)) {
    throw new Error('Form handler unavailable');
  }
}
