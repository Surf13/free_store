"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData) {
  const email = formData.get("email");
  const message = formData.get("message");

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    reply_to: email,
    to: ["kyle.r.s@aol.com"],
    subject: "Webstore Contact Message",
    html: `
      <div>
        <p>${message}</p>
        <p>From: ${email}</p>
      </div>
    `,
  });

  if (!response || response.error) {
    console.error("Resend error:", response?.error);
    throw new Error("Failed to send email");
  }

  return { status: "Email Sent!" };
}