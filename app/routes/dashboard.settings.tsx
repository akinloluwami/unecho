import { useState } from "react";
import { Save, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AppHeader from "~/components/app-header";
import { toast } from "sonner";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getProjectId, getUserId } from "~/lib/auth";
import { prisma } from "prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getUserId(request);
  const projectId = getProjectId(request);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
    select: {
      publicKey: true,
      secretKey: true,
    },
  });

  return json({
    user,
    keys: {
      public: project?.publicKey,
      secret: project?.secretKey,
    },
  });
};

export default function SettingsPage() {
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  const { user, keys } = useLoaderData<typeof loader>();

  return (
    <div>
      <AppHeader title="Settings" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} readOnly />
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter> */}
            </Card>
          </TabsContent>
          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Public Key</Label>
                  <div className="flex">
                    <Input
                      id="api-key"
                      type={showPublicKey ? "text" : "password"}
                      value={keys.public}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPublicKey(!showPublicKey)}
                      className="ml-2"
                    >
                      {showPublicKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(keys.public)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Use this on the frontend to send feedback.
                  </CardDescription>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <div className="flex">
                    <Input
                      id="secret-key"
                      type={showSecretKey ? "text" : "password"}
                      value={keys.secret}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="ml-2"
                    >
                      {showSecretKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(keys.secret)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    This key provides full access to your project, use securely
                    only on the backend.
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Settings | Unecho" }];
};
