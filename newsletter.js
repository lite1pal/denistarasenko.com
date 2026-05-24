function wireNewsletter(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const input = form.querySelector("input[name='email']");
    const email = input ? String(input.value || "").trim() : "";

    if (!email) return;

    if (button) button.disabled = true;
    if (button) button.textContent = "Sending...";
    status.textContent = "";

    try {
      const response = await fetch(
        "/api/playground-access",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) throw new Error("Request failed");
      form.reset();
      status.textContent = "Success. Expect quality writing soon.";
    } catch (error) {
      status.textContent = "Something went wrong. Please try again.";
    } finally {
      if (button) button.disabled = false;
      if (button) button.textContent = "Subscribe";
    }
  });
}

wireNewsletter("newsletter-start", "newsletter-status-start");
wireNewsletter("newsletter-why", "newsletter-status-why");
wireNewsletter("newsletter-form", "newsletter-status");
