import { html } from 'hono/html'

type Props = {
  firstName: string
  lastName: string
  url: string
}

export const onboardingEmail = ({
  firstName,
  lastName,
  url,
}: Props) => {
  const actionLink = url

  return html`
    <div style="background:#f5f5f5;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
      <div style="
        max-width:480px;
        margin:0 auto;
        background:#ffffff;
        border:1px solid #e0e0e0;
        box-shadow:0 4px 12px rgba(0,0,0,0.08);
        padding:32px;
      ">
        
        <h2 style="margin:0 0 16px 0;font-size:20px;color:#000;">
          Welcome ${firstName} ${lastName}
        </h2>

        <p style="margin:0 0 24px 0;color:#333;font-size:14px;line-height:1.6;">
          You're almost set. Please confirm your account to get started.
        </p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${actionLink}" style="
            display:inline-block;
            padding:12px 20px;
            background:#000;
            color:#fff;
            text-decoration:none;
            font-size:14px;
            border:1px solid #000;
          ">
            Activate Account
          </a>
        </div>

        <p style="margin:24px 0 0 0;color:#777;font-size:12px;line-height:1.5;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break:break-all;color:#000;font-size:12px;margin-top:8px;">
          ${actionLink}
        </p>

      </div>
    </div>
  `.toString()
}