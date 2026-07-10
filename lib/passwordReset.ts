import crypto from "crypto";

const RESET_TOKEN_MINUTOS = 30;

export function crearResetToken() {
  // Token que recibirá el usuario por correo
  const token = crypto.randomBytes(32).toString("hex");

  // Hash que guardaremos en la base de datos
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Expiración (30 minutos)
  const expira = new Date(
    Date.now() + RESET_TOKEN_MINUTOS * 60 * 1000
  );

  return {
    token,
    tokenHash,
    expira,
  };
}

export function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}