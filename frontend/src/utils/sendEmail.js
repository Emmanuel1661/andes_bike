// src/utils/sendEmail.js
import emailjs from "@emailjs/browser";

export async function sendFacturaEmail(params, pdfUrl) {
  return emailjs.send(
    "service_qxkwdtg",      // Tu Service ID
    "template_jfw6q1u",     // Tu Template ID
    {
      ...params,
      my_attachment: pdfUrl, // Así se adjunta el PDF
    },
    "CSkwQfwDZ4pjqjiNt"      // Tu Public Key
  );
}
