import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export type GetLocalDatasetResult = {
  error?: string;
  result?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetLocalDatasetResult>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const datasetDirectory = path.join(process.cwd(), "dataset");
  const files = await fs.readdir(datasetDirectory);
  res.status(200).json({ result: files });
}
