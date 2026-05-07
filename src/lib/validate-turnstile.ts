import { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { HttpBadRequest } from "@httpx/exception";
import { apiFetch } from "./api";
import { isErr } from "@justmiracle/result";

export async function validateTurnstile(
  token: string,
  remoteip: string,
  expectedAction?: string,
  expectedHostname?: string,
): Promise<TurnstileServerValidationResponse> {
  const res = await apiFetch<TurnstileServerValidationResponse>(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip,
      }),
    },
  );

  if (isErr(res)) {
    throw new HttpBadRequest("Captcha validation failed");
  }

  const validation = res.value;

  if (!validation.success) {
    throw new HttpBadRequest("Captcha validation failed");
  }

  if (expectedAction && validation.action !== expectedAction) {
    throw new HttpBadRequest(
      `Captcha action mismatch: expected "${expectedAction}", got "${validation.action}"`,
    );
  }

  if (expectedHostname && validation.hostname !== expectedHostname) {
    throw new HttpBadRequest(
      `Captcha hostname mismatch: expected "${expectedHostname}", got "${validation.hostname}"`,
    );
  }

  if (validation.challenge_ts) {
    console.log("TimeStamps", new Date(validation.challenge_ts));
    const ageMinutes =
      (Date.now() - new Date(validation.challenge_ts).getTime()) / (1000 * 60);
    console.log("Age Minutes", ageMinutes);
    if (ageMinutes > 4) {
      console.warn(`Turnstile token is ${ageMinutes.toFixed(1)} minutes old`);
    }
  }

  return validation;
}
