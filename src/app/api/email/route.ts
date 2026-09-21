import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
const normalizedSmtpPass = String(SMTP_PASS || "").replace(/\s+/g, "");

function makeSafeHtml(text: string) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br />");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const to = String(body?.to || SMTP_USER || "Xaritoomentorship@gmail.com");
    const subject = String(body?.subject || "New message from Xaritoo website");
    const message = String(body?.message || "");
    const name = String(body?.name || "Website visitor");
    const senderEmail = body?.email ? String(body.email) : undefined;
    const replyTo = body?.replyTo ? String(body.replyTo) : senderEmail;

    if (!smtpConfigured || !normalizedSmtpPass) {
      return NextResponse.json(
        { error: "SMTP is not configured on the server." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: String(SMTP_USER).trim(),
        pass: normalizedSmtpPass,
      },
    });

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px; color: #4c1d95;">New Xaritoo submission</h2>
        <p><strong>Name:</strong> ${makeSafeHtml(name)}</p>
        ${replyTo ? `<p><strong>Email:</strong> ${makeSafeHtml(replyTo)}</p>` : ""}
        <p><strong>Subject:</strong> ${makeSafeHtml(subject)}</p>
        <div style="white-space: pre-wrap; margin-top: 16px; border-left: 4px solid #7c3aed; padding-left: 12px;">
          ${makeSafeHtml(message)}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to,
      replyTo,
      subject,
      text: message,
      html: adminHtml,
    });

    if (senderEmail && senderEmail.toLowerCase() !== to.toLowerCase()) {
      const confirmationSubject = "We received your Xaritoo request";
      const confirmationText = [
        `Hello ${name || "there"},`,
        "",
        "Thank you for contacting Xaritoo.",
        "We have received your request and our team is reviewing it.",
        "We will reach out to you soon with the next steps.",
        "",
        "Your message:",
        message,
      ].join("\n");

      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
          <h2 style="margin-bottom: 12px; color: #4c1d95;">Thank you for reaching out to Xaritoo</h2>
          <p>Hello ${makeSafeHtml(name || "there")},</p>
          <p>We have received your request and our team is currently reviewing it.</p>
          <p>We will contact you soon with the next steps.</p>
          <div style="margin-top: 20px; padding: 14px 16px; background: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 8px;">
            <strong>Your message:</strong><br />
            ${makeSafeHtml(message)}
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: SMTP_FROM || SMTP_USER,
        to: senderEmail,
        replyTo: String(SMTP_USER),
        subject: confirmationSubject,
        text: confirmationText,
        html: confirmationHtml,
      });
    }

    return NextResponse.json({ ok: true, sentTo: to, confirmationSent: Boolean(senderEmail && senderEmail.toLowerCase() !== to.toLowerCase()) });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to send email.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
