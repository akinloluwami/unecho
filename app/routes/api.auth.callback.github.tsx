import { LoaderFunction, redirect, json } from "@remix-run/node";
import { Octokit } from "octokit";
import axios from "axios";

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

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": `preparedData=${JSON.stringify(preparedData)}`,
        },
      });
    } else {
      return json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return json({ message: "Something went wrong" }, { status: 500 });
  }
};
