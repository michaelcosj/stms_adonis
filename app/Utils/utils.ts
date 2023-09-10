import crypto from "crypto";

export function generateOTP(length: number) {
  const randNum = crypto.randomInt(0, 10 ** length);
  return randNum.toString().padStart(length, "0");
}
