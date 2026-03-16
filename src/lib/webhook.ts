export async function triggerWebhook(payload: any) {
  const webhookUrl = process.env.UPDATE_TRAIL_WEBHOOK_URL;

  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.WEBHOOK_SECRET || "",
      },
      body: JSON.stringify({
        event: "trail.created",
        timestamp: new Date().toISOString(),
        data: payload,
      }),
    });

    if (!response.ok) {
      console.error(`Webhook failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Webhook Error:", error);
  }
}