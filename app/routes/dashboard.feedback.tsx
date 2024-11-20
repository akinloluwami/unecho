import AppHeader from "~/components/app-header";
import { useState } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { prisma } from "prisma/client";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MetaFunction } from "@remix-run/react";
import { getCookie } from "~/lib/cookies";
import { getUserIdFromToken } from "~/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const sentiment = url.searchParams.get("sentiment") || ("all" as any);
  const itemsPerPage = 10;

  const whereCondition = sentiment === "all" ? {} : { sentiment };
  const projectId = getCookie(request, "unecho.project-id")!;
  const userToken = getCookie(request, "unecho.auth-token")!;
  const userId = getUserIdFromToken(userToken)!;

  const feedbackData = await prisma.feedback.findMany({
    where: {
      ...whereCondition,
      projectId,
      project: {
        userId,
      },
    },
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      clientUserProfile: {
        select: { name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalFeedbacks = await prisma.feedback.count({ where: whereCondition });
  const totalPages = Math.ceil(totalFeedbacks / itemsPerPage);

  return json({
    feedbackData: feedbackData.map((feedback) => ({
      id: feedback.id,
      user: feedback?.clientUserProfile?.name || "",
      email: feedback.clientUserProfile?.email || "",
      avatar: feedback.clientUserProfile?.avatar || "",
      sentiment: feedback.sentiment,
      score: feedback.score,
      feedback: feedback.content,
      date: feedback.createdAt.toISOString().split("T")[0],
    })),
    page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    sentiment,
  });
};

const Feedback = () => {
  const { feedbackData, page, hasNextPage, hasPreviousPage, sentiment } =
    useLoaderData<typeof loader>();
  const [selectedSentiment, setSelectedSentiment] = useState(sentiment);
  const navigate = useNavigate();

  const handleSentimentChange = (value: string) => {
    setSelectedSentiment(value);
    navigate(`?page=1&sentiment=${value}`);
  };

  return (
    <div>
      <AppHeader title="Feedback" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <CardTitle>Feedback Entries</CardTitle>
                <CardDescription>View and manage user feedback</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Select
                  value={selectedSentiment}
                  onValueChange={handleSentimentChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackData.map((feedback: any) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={feedback.avatar}
                            className="w-full h-full object-cover"
                          />
                          <AvatarFallback>
                            {feedback.user.charAt(0) ||
                              feedback.email.charAt(0) ||
                              ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {feedback.user || "Anonymous"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feedback.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          feedback.sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : feedback.sentiment === "neutral"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {feedback.sentiment}
                      </span>
                    </TableCell>
                    <TableCell>{feedback.score}</TableCell>
                    <TableCell className="max-w-sm truncate">
                      {feedback.feedback}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {feedback.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                View Details
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="lg:max-w-[500px] w-[90%] rounded-md">
                              <DialogHeader>
                                <DialogTitle>Feedback Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the selected feedback
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                {!!feedback.user && (
                                  <div className="flex items-center gap-4">
                                    <Label className="text-right">User</Label>
                                    <div className="col-span-3">
                                      {feedback.user}
                                    </div>
                                  </div>
                                )}
                                {!!feedback.email && (
                                  <div className="flex items-center gap-4">
                                    <Label className="text-right">Email</Label>
                                    <div className="col-span-3">
                                      {feedback.email}
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-4">
                                  <Label className="text-right">
                                    Sentiment
                                  </Label>
                                  <div className="col-span-3">
                                    <span
                                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                        feedback.sentiment === "positive"
                                          ? "bg-green-100 text-green-800"
                                          : feedback.sentiment === "neutral"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {feedback.sentiment}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Label className="text-right">Date</Label>
                                  <div className="col-span-3">
                                    {feedback.date}
                                  </div>
                                </div>
                                <div className="">
                                  <Label className="text-right">Feedback</Label>
                                  <div className="col-span-3">
                                    {feedback.feedback}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {/* <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-x-4 mt-4">
              <Link
                to={`?page=${page - 1}&sentiment=${selectedSentiment}`}
                className={!hasPreviousPage ? "pointer-events-none" : ""}
              >
                <Button disabled={!hasPreviousPage}>Previous</Button>
              </Link>
              <Link
                to={`?page=${page + 1}&sentiment=${selectedSentiment}`}
                className={!hasNextPage ? "pointer-events-none" : ""}
              >
                <Button disabled={!hasNextPage}>Next</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;

export const meta: MetaFunction = () => {
  return [{ title: "Feedback | Unecho" }];
};
