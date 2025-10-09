"use node"

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const MASTER_KEY = process.env.MASTER_KEY as string; 
const IV_LENGTH = 16;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(MASTER_KEY, "utf8"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}

export function decrypt(encrypted: { iv: string; content: string }) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(MASTER_KEY, "utf8"),
    Buffer.from(encrypted.iv, "hex")
  );
  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
