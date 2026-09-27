import { clearSession } from "../../../lib/auth";

export default function handler(req, res) {
  clearSession(res);
  res.redirect(303, "/");
}
