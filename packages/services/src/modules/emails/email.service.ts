import { createTransport } from 'nodemailer';
import { EMAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '@/constants';
import { onboardingEmail } from '@/modules/users/htmls/user.onboarding.html';
import { UserOnboardingEmailPayload } from '@turbo-starter/queues';
import { AttachmentLike } from 'nodemailer/lib/mailer';

export class EmailService {
  private getTransporter() {
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete.');
    }

    return createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      from: EMAIL_FROM,
    });
  }

  private async sendEmail(
    email: string[],
    subject: string,
    html: string,
    attachments?: AttachmentLike[]
  ) {
    try {
      let transporter = this.getTransporter();
      await transporter.sendMail({
        to: email,
        subject: subject,
        html: html,
        attachments: attachments,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  public async sendVerificationEmail({ user, url }: UserOnboardingEmailPayload) {
    let html = onboardingEmail({
      firstName: user.firstName,
      lastName: user.lastName,
      url
    });

    return await this.sendEmail([user.email], 'Welcome! Please verify your email', html);
  }
}
