import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Octokit } from "octokit";
import axios from "axios";
import { prisma } from "../../prisma/client";
import { generateApiKey } from "~/lib/utils";
import { createAuthToken } from "~/lib/auth";
import dayjs from "dayjs";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code)
    return json(
      { message: "Code query parameter is missing" },
      { status: 400 }
    );

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }
    );

    const accessToken = new URLSearchParams(tokenResponse.data).get(
      "access_token"
    );
    if (!accessToken) return json({ message: "Unauthorized" }, { status: 401 });

    const octokit = new Octokit({ auth: accessToken });
    const { data: user } = await octokit.request("GET /user");
    const emailData = await octokit.request("GET /user/emails");
    const email = emailData.data.find((e) => e.primary)?.email || "";

    let userId: string;
    let projectId: string;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      userId = existingUser.id;
      const existingProject = await prisma.project.findFirst({
        where: { userId },
      });
      projectId = existingProject?.id || "";
      return setCookieAndRedirect(userId, projectId);
    }

    const newUser = await prisma.user.create({
      data: { email, name: user.name || "", signupVia: "github" },
    });
    userId = newUser.id;

    const newProject = await prisma.project.create({
      data: {
        name: `${user.name || "New User"}'s Project`,
        secretKey: `sk_UE${generateApiKey()}`,
        publicKey: `pk_UE${generateApiKey()}`,
        userId,
      },
    });
    projectId = newProject.id;

    return setCookieAndRedirect(userId, projectId);
  } catch (error) {
    console.error(error);
    return json({ message: "Something went wrong" }, { status: 500 });
  }
};

const setCookieAndRedirect = async (userId: string, projectId: string) => {
  const authToken = await createAuthToken(userId);
  return redirect("/dashboard", {
    headers: [
      [
        "Set-Cookie",
        `unecho.auth-token=${authToken}; HttpOnly; Path=/; Max-Age=${dayjs()
          .add(90, "days")
          .unix()}`,
      ],
      [
        "Set-Cookie",
        `unecho.project-id=${projectId}; Path=/; Max-Age=${dayjs()
          .add(90, "days")
          .unix()}`,
      ],
    ],
  });
};
