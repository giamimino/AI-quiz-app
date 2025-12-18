let currentController: AbortController | null = null;

export async function fetchMessages({
  url,
  conversationId,
  oldestMessageId,
}: {
  url: string;
  conversationId: string;
  oldestMessageId: string;
}) {
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();
  const signal = currentController.signal;

  try {
    const response = await fetch(url, {
      signal,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldestMessageId, conversationId }),
    });
    const data = await response.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("Previous request aborted");
    } else {
      console.error(err);
    }
  }
}
