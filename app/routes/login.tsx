import { Link, MetaFunction } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Here you would typically redirect to Google OAuth
    console.log("Google login initiated");
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    const githubClientId = "Ov23liqBAP1Ll3kYfEAB";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Choose a service to login with
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SiGoogle className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button>
          <Button
            variant="outline"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SiGithub className="mr-2 h-4 w-4" />
            )}{" "}
            Github
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            New to Unecho?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Login | Unecho" }];
};
