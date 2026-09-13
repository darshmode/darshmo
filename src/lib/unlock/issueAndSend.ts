import { createAccessToken } from "./token";
import { sendAccessEmail } from "./email";

export type IssueResult = {
  token: string;
  emailSent: boolean;
  warning?: string;
};

/**
 * Shared by the initial unlock request and the "send my link again" resend
 * request: same deterministic token for a given email, same delivery path.
 */
export async function issueAndSendAccess(email: string): Promise<IssueResult> {
  const token = createAccessToken(email);

  try {
    await sendAccessEmail(email, token);
    return { token, emailSent: true };
  } catch (err) {
    console.error("[unlock] failed to send access email", err);
    return {
      token,
      emailSent: false,
      warning: "Unlocked on this device, but the email couldn't be sent. Try \"get your link again\" shortly.",
    };
  }
}
