import React from "react";
import AppHeader from "~/components/app-header";
import { useState } from "react";
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
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const feedbackData = [
  {
    id: 1,
    user: "Alice Johnson",
    email: "alice@example.com",
    sentiment: "Positive",
    feedback:
      "The new feature is amazing! It has greatly improved my workflow.",
    date: "2023-06-15",
    status: "New",
  },
  {
    id: 2,
    user: "Bob Smith",
    email: "bob@example.com",
    sentiment: "Neutral",
    feedback:
      "The app works fine, but I think there's room for improvement in the user interface.",
    date: "2023-06-14",
    status: "In Progress",
  },
  {
    id: 3,
    user: "Charlie Brown",
    email: "charlie@example.com",
    sentiment: "Negative",
    feedback:
      "I encountered a bug that prevented me from saving my work. This is a critical issue that needs to be addressed.",
    date: "2023-06-13",
    status: "Resolved",
  },
  {
    id: 4,
    user: "Diana Prince",
    email: "diana@example.com",
    sentiment: "Positive",
    feedback:
      "The customer support team was incredibly helpful in resolving my issue. Great service!",
    date: "2023-06-12",
    status: "New",
  },
  {
    id: 5,
    user: "Ethan Hunt",
    email: "ethan@example.com",
    sentiment: "Neutral",
    feedback:
      "The new update is okay, but I preferred some aspects of the previous version.",
    date: "2023-06-11",
    status: "In Progress",
  },
];

const Feedback = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeedback = feedbackData.filter(
    (feedback) =>
      (selectedStatus === "All" || feedback.status === selectedStatus) &&
      (selectedSentiment === "All" ||
        feedback.sentiment === selectedSentiment) &&
      (feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.user.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div>
      <AppHeader title="Feedback" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Feedback Entries</CardTitle>
                <CardDescription>View and manage user feedback</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedSentiment}
                  onValueChange={setSelectedSentiment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sentiments</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
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
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {feedback.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{feedback.user}</div>
                          <div className="text-sm text-gray-500">
                            {feedback.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          feedback.sentiment === "Positive"
                            ? "bg-green-100 text-green-800"
                            : feedback.sentiment === "Neutral"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {feedback.sentiment}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {feedback.feedback}
                    </TableCell>
                    <TableCell>{feedback.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
