import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Mock data - nantinya bisa ambil dari database
  return res.status(200).json({
    name: email?.split("@")[0] || "User",
    email: email || "",
    cvCount: 3,
    applied: 2,
  });
}
