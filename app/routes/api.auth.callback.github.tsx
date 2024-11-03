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

  if (!code) {
    return json(
      { message: "Code query parameter is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }
    );

    const accessToken = new URLSearchParams(response.data).get("access_token");

    if (accessToken) {
      const octokit = new Octokit({ auth: accessToken });

      const userResponse = await octokit.request("GET /user");
      const userEmails = await octokit.request("GET /user/emails");

      const user = userResponse.data;
      const email = userEmails.data.find((e) => e.primary)?.email;

      const preparedData = {
        email: email || "",
        name: user.name || "",
        githubId: user.id,
      };

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        const authToken = await createAuthToken(existingUser.id);
        return redirect("/dashboard", {
          headers: [
            [
              "Set-Cookie",
              `unecho.auth-token=${authToken}; HttpOnly; Path=/; Max-Age=${dayjs()
                .add(90, "days")
                .unix()}`,
            ],
          ],
        });
      }

      const newUser = await prisma.user.create({
        data: {
          email: preparedData.email,
          name: preparedData.name,
        },
      });

      await prisma.project.create({
        data: {
          name: `${preparedData.name}'s Project`,
          secretKey: `sk_UE${generateApiKey()}`,
          publicKey: `pk_UE${generateApiKey()}`,
          userId: newUser.id,
        },
      });

      const authToken = await createAuthToken(newUser.id);
      return redirect("/dashboard", {
        headers: [
          [
            "Set-Cookie",
            `unecho.auth-token=${authToken}; HttpOnly; Path=/; Max-Age=${dayjs()
              .add(90, "days")
              .unix()}`,
          ],
        ],
      });
    } else {
      return json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return json({ message: "Something went wrong" }, { status: 500 });
  }
};
