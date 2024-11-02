import { MetaFunction } from "@remix-run/react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import AppHeader from "~/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const chartData = [
  { name: "Mon", positive: 4, neutral: 3, negative: 2 },
  { name: "Tue", positive: 3, neutral: 4, negative: 1 },
  { name: "Wed", positive: 5, neutral: 2, negative: 3 },
  { name: "Thu", positive: 6, neutral: 3, negative: 1 },
  { name: "Fri", positive: 4, neutral: 4, negative: 2 },
  { name: "Sat", positive: 3, neutral: 5, negative: 1 },
  { name: "Sun", positive: 5, neutral: 3, negative: 2 },
];

const recentFeedback = [
  {
    id: 1,
    user: "Alice",
    sentiment: "Positive",
    feedback: "The new feature is amazing!",
    date: "2023-06-15",
  },
  {
    id: 2,
    user: "Bob",
    sentiment: "Neutral",
    feedback: "It works fine, but could be improved.",
    date: "2023-06-14",
  },
  {
    id: 3,
    user: "Charlie",
    sentiment: "Negative",
    feedback: "I encountered a bug in the latest update.",
    date: "2023-06-13",
  },
  {
    id: 4,
    user: "Diana",
    sentiment: "Positive",
    feedback: "Customer support was very helpful.",
    date: "2023-06-12",
  },
  {
    id: 5,
    user: "Eve",
    sentiment: "Neutral",
    feedback: "The interface is okay, but a bit confusing.",
    date: "2023-06-11",
  },
];

const DashboardIndex = () => {
  return (
    <div>
      <AppHeader title="Dashboard" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Positive Feedback
              </CardTitle>
              <div className="bg-green-500 rounded-full size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Neutral Feedback
              </CardTitle>
              <div className="bg-yellow-500 rounded-full size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25%</div>
              <p className="text-xs text-muted-foreground">
                -1% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Negative Feedback
              </CardTitle>
              <div className="bg-red-500 rounded-full size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10%</div>
              <p className="text-xs text-muted-foreground">
                -1% from last week
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
            <CardDescription>
              Weekly overview of feedback sentiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke="#eab308"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              Latest user feedback and sentiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.user}</TableCell>
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
                    <TableCell>{feedback.feedback}</TableCell>
                    <TableCell>{feedback.date}</TableCell>
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

export default DashboardIndex;

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | Unecho" }];
};
