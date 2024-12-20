import { LoaderFunction, json } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
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
import { getProjectId, getUserId } from "~/lib/auth";
import { getFeedbackSentimentData } from "~/services/analytics/getFeedbackSentimentData";
import { getWeeklyFeedbackChartData } from "~/services/analytics/getWeeklyFeedbackChartData";
import { getRecentFeedback } from "~/services/feedback/getRecentFeedback";

interface RecentFeedback {
  id: string;
  user: string;
  sentiment: string;
  feedback: string;
  date: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const projectId = getProjectId(request);
  const userId = getUserId(request);

  const stat = await getFeedbackSentimentData(projectId, userId);
  const chartData = await getWeeklyFeedbackChartData(projectId, userId);
  const recentFeedback = await getRecentFeedback(projectId, userId);

  return json({ stat, chartData, recentFeedback });
};

const DashboardIndex = () => {
  const { stat, chartData, recentFeedback } = useLoaderData<{
    stat: any;
    chartData: any;
    recentFeedback: RecentFeedback[];
  }>();

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
              <div className="text-2xl font-bold">
                {stat["positive"].percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stat["positive"].changeFromLastWeek || 0}% from last week
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
              <div className="text-2xl font-bold">
                {stat["neutral"].percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stat["neutral"].changeFromLastWeek || 0}% from last week
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
              <div className="text-2xl font-bold">
                {stat["negative"].percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stat["negative"].changeFromLastWeek || 0}% from last week
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
            <div className="flex justify-between">
              <div className="">
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>
                  Latest user feedback and sentiments
                </CardDescription>
              </div>
              <Link to="/dashboard/feedback">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Sentiment</TableHead>
                  {/* <TableHead>Feedback</TableHead> */}
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.user || "Anonymous"}</TableCell>
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
                    {/* <TableCell>{feedback.feedback}</TableCell> */}
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
