package smart.campus.Backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:Smart Campus Hub <noreply@smartcampus.com>}")
    private String fromAddress;

    /**
     * Send an HTML email asynchronously so it never blocks the API response.
     */
    @Async
    public void sendHtml(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} — subject: {}", toEmail, subject);
        } catch (MessagingException e) {
            // Log but never crash the main flow — email is best-effort
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ─── Booking emails ──────────────────────────────────────────────────────

    public void sendBookingReceived(String toEmail, String userName,
                                    String resourceName, long bookingId,
                                    String startTime, String endTime, String purpose) {
        String subject = "Booking Request Received — " + resourceName;
        String body = baseTemplate(
            "Booking Request Received",
            "#f59e0b",
            "📅",
            "Hi " + userName + ",",
            "<p>Your booking request has been <strong>submitted</strong> and is awaiting admin approval.</p>"
            + detailsTable(new String[][]{
                {"Booking ID",  "#" + bookingId},
                {"Resource",    resourceName},
                {"Purpose",     purpose != null && !purpose.isBlank() ? purpose : "—"},
                {"Start Time",  startTime},
                {"End Time",    endTime},
                {"Status",      badge("PENDING", "#f59e0b")},
            }),
            "We'll email you as soon as the admin reviews your request."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendBookingApproved(String toEmail, String userName,
                                    String resourceName, long bookingId,
                                    String startTime, String endTime) {
        String subject = "✅ Booking Approved — " + resourceName;
        String body = baseTemplate(
            "Booking Approved!",
            "#10b981",
            "✅",
            "Great news, " + userName + "!",
            "<p>Your booking has been <strong>approved</strong>. You're all set.</p>"
            + detailsTable(new String[][]{
                {"Booking ID",  "#" + bookingId},
                {"Resource",    resourceName},
                {"Start Time",  startTime},
                {"End Time",    endTime},
                {"Status",      badge("APPROVED", "#10b981")},
            }),
            "Please arrive on time and follow campus resource usage guidelines."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendBookingRejected(String toEmail, String userName,
                                    String resourceName, long bookingId) {
        String subject = "❌ Booking Rejected — " + resourceName;
        String body = baseTemplate(
            "Booking Rejected",
            "#ef4444",
            "❌",
            "Hi " + userName + ",",
            "<p>Unfortunately, your booking request for <strong>" + resourceName
            + "</strong> (Booking #" + bookingId + ") has been <strong>rejected</strong> by an administrator.</p>"
            + "<p>You may submit a new request for a different time slot or resource.</p>",
            "Contact campus administration if you believe this is an error."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendBookingCancelled(String toEmail, String userName,
                                     String resourceName, long bookingId) {
        String subject = "🚫 Booking Cancelled — " + resourceName;
        String body = baseTemplate(
            "Booking Cancelled",
            "#64748b",
            "🚫",
            "Hi " + userName + ",",
            "<p>Your booking for <strong>" + resourceName
            + "</strong> (Booking #" + bookingId + ") has been <strong>cancelled</strong>.</p>",
            "You can create a new booking at any time from the Smart Campus portal."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendBookingDeleted(String toEmail, String userName,
                                   String resourceName, long bookingId) {
        String subject = "🗑️ Booking Removed — " + resourceName;
        String body = baseTemplate(
            "Booking Removed",
            "#ef4444",
            "🗑️",
            "Hi " + userName + ",",
            "<p>Your booking for <strong>" + resourceName
            + "</strong> (Booking #" + bookingId + ") has been <strong>deleted</strong> by an administrator.</p>",
            "Contact campus administration for more information."
        );
        sendHtml(toEmail, subject, body);
    }

    // ─── Ticket emails ───────────────────────────────────────────────────────

    public void sendTicketReceived(String toEmail, String userName,
                                   long ticketId, String resourceName,
                                   String category, String priority, String description) {
        String subject = "Ticket Submitted — #" + ticketId;
        String body = baseTemplate(
            "Incident Ticket Submitted",
            "#6366f1",
            "🎫",
            "Hi " + userName + ",",
            "<p>Your incident ticket has been <strong>submitted</strong> and assigned to our support team.</p>"
            + detailsTable(new String[][]{
                {"Ticket ID",   "#" + ticketId},
                {"Resource",    resourceName},
                {"Category",    category},
                {"Priority",    badge(priority, priorityColor(priority))},
                {"Description", description},
                {"Status",      badge("OPEN", "#6366f1")},
            }),
            "Our team will review and update you as soon as possible."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketInProgress(String toEmail, String userName,
                                     long ticketId, String resourceName) {
        String subject = "🔧 Ticket In Progress — #" + ticketId;
        String body = baseTemplate(
            "Your Ticket Is Being Worked On",
            "#f59e0b",
            "🔧",
            "Hi " + userName + ",",
            "<p>Good news! Ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> is now <strong>in progress</strong>.</p>"
            + "<p>Our maintenance team is actively working on your reported issue.</p>",
            "We'll notify you again once the issue is resolved."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketResolved(String toEmail, String userName,
                                   long ticketId, String resourceName) {
        String subject = "✅ Ticket Resolved — #" + ticketId;
        String body = baseTemplate(
            "Ticket Resolved!",
            "#10b981",
            "✅",
            "Hi " + userName + ",",
            "<p>Your ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> has been <strong>resolved</strong>.</p>"
            + "<p>If the issue persists, please submit a new ticket from the Smart Campus portal.</p>",
            "Thank you for helping us keep the campus running smoothly."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketClosed(String toEmail, String userName,
                                 long ticketId, String resourceName) {
        String subject = "🔒 Ticket Closed — #" + ticketId;
        String body = baseTemplate(
            "Ticket Closed",
            "#64748b",
            "🔒",
            "Hi " + userName + ",",
            "<p>Ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> has been <strong>closed</strong>.</p>",
            "Submit a new ticket anytime if you experience further issues."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketRejected(String toEmail, String userName,
                                   long ticketId, String resourceName) {
        String subject = "❌ Ticket Rejected — #" + ticketId;
        String body = baseTemplate(
            "Ticket Rejected",
            "#ef4444",
            "❌",
            "Hi " + userName + ",",
            "<p>Ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> has been <strong>rejected</strong> by an administrator.</p>"
            + "<p>Please contact campus administration if you believe this is an error.</p>",
            ""
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketDeleted(String toEmail, String userName,
                                  long ticketId, String resourceName) {
        String subject = "🗑️ Ticket Removed — #" + ticketId;
        String body = baseTemplate(
            "Ticket Removed",
            "#ef4444",
            "🗑️",
            "Hi " + userName + ",",
            "<p>Your ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> has been <strong>removed</strong> by an administrator.</p>",
            "Contact campus administration for more information."
        );
        sendHtml(toEmail, subject, body);
    }

    public void sendTicketAssigned(String toEmail, String userName,
                                   long ticketId, String resourceName, String assigneeName) {
        String subject = "🔧 Ticket Assigned — #" + ticketId;
        String body = baseTemplate(
            "Ticket Assigned",
            "#f59e0b",
            "🔧",
            "Hi " + userName + ",",
            "<p>Your ticket <strong>#" + ticketId + "</strong> for <strong>"
            + resourceName + "</strong> has been assigned to <strong>"
            + assigneeName + "</strong> and is now in progress.</p>",
            "We'll keep you updated on the progress."
        );
        sendHtml(toEmail, subject, body);
    }

    // ─── HTML helpers ────────────────────────────────────────────────────────

    private String baseTemplate(String title, String accentColor, String emoji,
                                 String greeting, String content, String footer) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
                <tr><td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;">

                    <!-- Header accent bar -->
                    <tr><td style="background:%s;height:4px;border-radius:12px 12px 0 0;"></td></tr>

                    <!-- Card body -->
                    <tr><td style="background:#1e293b;padding:36px 40px;border-radius:0 0 12px 12px;
                                   border:1px solid rgba(255,255,255,0.07);border-top:none;">

                      <!-- Emoji + Title -->
                      <div style="font-size:2rem;margin-bottom:8px;">%s</div>
                      <h1 style="color:#f8fafc;font-size:1.4rem;font-weight:700;margin:0 0 8px;">%s</h1>
                      <p style="color:#94a3b8;font-size:0.95rem;margin:0 0 24px;">%s</p>

                      <!-- Content -->
                      <div style="color:#cbd5e1;font-size:0.9rem;line-height:1.6;">%s</div>

                      <!-- Footer note -->
                      %s

                      <!-- Divider -->
                      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;">

                      <!-- Brand footer -->
                      <p style="color:#475569;font-size:0.78rem;margin:0;text-align:center;">
                        Smart Campus Hub &nbsp;·&nbsp; This is an automated message, please do not reply.
                      </p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(
                accentColor, emoji, title, greeting, content,
                footer.isBlank() ? "" :
                    "<p style=\"color:#64748b;font-size:0.82rem;margin:20px 0 0;\">" + footer + "</p>"
            );
    }

    private String detailsTable(String[][] rows) {
        StringBuilder sb = new StringBuilder(
            "<table width=\"100%%\" cellpadding=\"0\" cellspacing=\"0\" "
            + "style=\"margin:20px 0;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);\">");
        for (int i = 0; i < rows.length; i++) {
            String bg = i % 2 == 0 ? "rgba(255,255,255,0.03)" : "transparent";
            sb.append("<tr style=\"background:").append(bg).append(";\">")
              .append("<td style=\"padding:10px 16px;color:#94a3b8;font-size:0.82rem;width:120px;\">")
              .append(rows[i][0]).append("</td>")
              .append("<td style=\"padding:10px 16px;color:#f1f5f9;font-size:0.88rem;font-weight:500;\">")
              .append(rows[i][1]).append("</td>")
              .append("</tr>");
        }
        sb.append("</table>");
        return sb.toString();
    }

    private String badge(String text, String color) {
        return "<span style=\"display:inline-block;background:" + color + "22;color:" + color
            + ";padding:2px 10px;border-radius:12px;font-size:0.78rem;font-weight:700;\">"
            + text + "</span>";
    }

    private String priorityColor(String priority) {
        return switch (priority) {
            case "HIGH"   -> "#ef4444";
            case "MEDIUM" -> "#f59e0b";
            default       -> "#10b981";
        };
    }
}
