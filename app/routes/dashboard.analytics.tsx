import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AppHeader from "~/components/app-header";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { getCookie } from "~/lib/cookies";
import { getUserIdFromToken } from "~/lib/auth";
import { prisma } from "prisma/client";
import dayjs from "dayjs";

export const loader: LoaderFunction = async ({ request }) => {
  const projectId = getCookie(request, "unecho.project-id")!;
  const userToken = getCookie(request, "unecho.auth-token")!;
  const userId = getUserIdFromToken(userToken)!;

  const whereCondition = { projectId, project: { userId } };

  const totalFeedbacks = await prisma.feedback.count({
    where: whereCondition,
  });

  const averageSentimentScore = await prisma.feedback.aggregate({
    where: whereCondition,
    _avg: {
      score: true,
    },
  });

  const startOfWeek = dayjs().startOf("week").toDate();
  const endOfWeek = dayjs().endOf("week").toDate();
  const feedbacksThisWeek = await prisma.feedback.findMany({
    where: {
      ...whereCondition,
      createdAt: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
  });
  const feedbackVolumeData = Array.from({ length: 7 }, (_, i) => {
    const day = dayjs(startOfWeek).add(i, "day");
    const count = feedbacksThisWeek.filter((feedback) =>
      dayjs(feedback.createdAt).isSame(day, "day")
    ).length;

    return {
      name: day.format("ddd"),
      volume: count,
    };
  });

  const startOfMonth = dayjs().startOf("month");
  const daysInMonth = startOfMonth.daysInMonth();

  const sentimentTrendData = await Promise.all(
    Array.from({ length: daysInMonth }, async (_, i) => {
      const dayStart = startOfMonth.add(i, "day").startOf("day").toDate();
      const dayEnd = startOfMonth.add(i, "day").endOf("day").toDate();

      const dailyFeedbackCounts = await prisma.feedback.groupBy({
        by: ["sentiment"],
        where: {
          ...whereCondition,
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        _count: {
          sentiment: true,
        },
      });

      const sentimentData = {
        positive: 0,
        neutral: 0,
        negative: 0,
      };

      dailyFeedbackCounts.forEach(({ sentiment, _count }) => {
        if (sentiment === "positive") sentimentData.positive = _count.sentiment;
        else if (sentiment === "neutral")
          sentimentData.neutral = _count.sentiment;
        else if (sentiment === "negative")
          sentimentData.negative = _count.sentiment;
      });

      return {
        day: (i + 1).toString(),
        ...sentimentData,
      };
    })
  );

  const startOfLastMonth = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .toDate();
  const endOfLastMonth = dayjs().subtract(1, "month").endOf("month").toDate();

  const lastMonthTotalFeedbacks = await prisma.feedback.count({
    where: {
      ...whereCondition,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });

  const lastMonthAverageSentimentScore = await prisma.feedback.aggregate({
    where: {
      ...whereCondition,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
    _avg: {
      score: true,
    },
  });

  const feedbackChangePercentage =
    lastMonthTotalFeedbacks > 0
      ? ((totalFeedbacks - lastMonthTotalFeedbacks) / lastMonthTotalFeedbacks) *
        100
      : 0;

  const sentimentScoreChange =
    lastMonthAverageSentimentScore._avg.score !== null
      ? (averageSentimentScore._avg.score ?? 0) -
        lastMonthAverageSentimentScore._avg.score
      : 0;

  return json({
    stat: {
      feedback: {
        value: totalFeedbacks,
        changePercentage: feedbackChangePercentage.toFixed(1),
      },
      sentimentScore: {
        value: averageSentimentScore._avg.score?.toFixed(1),
        change: sentimentScoreChange.toFixed(1),
      },
    },
    feedbackVolumeData,
    sentimentTrendData,
  });
};

export default function AnalyticsPage() {
  const { stat, feedbackVolumeData, sentimentTrendData } =
    useLoaderData<typeof loader>();
  return (
    <div className="">
      <AppHeader title="Analytics" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.feedback.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.feedback.changePercentage}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Sentiment Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.sentimentScore.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.sentimentScore.change} from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
              <CardDescription>Monthly sentiment distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrendData}>
                    <XAxis dataKey="day" />
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
              <CardTitle>Feedback Volume</CardTitle>
              <CardDescription>Daily feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feedbackVolumeData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Card>
          <CardHeader>
            <CardTitle>Top Feedback</CardTitle>
            <CardDescription>Most impactful feedback received</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="positive" className="w-full">
              <TabsList>
                <TabsTrigger value="positive">Positive</TabsTrigger>
                <TabsTrigger value="negative">Negative</TabsTrigger>
              </TabsList>
              <TabsContent value="positive">
                <ul className="space-y-4">
                  <li className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">
                      "The new feature has greatly improved my workflow. It's
                      intuitive and saves me a lot of time!"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      - John Doe, 2 days ago
                    </p>
                  </li>
                  <li className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">
                      "Customer support was extremely helpful and resolved my
                      issue quickly. Great service!"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      - Jane Smith, 3 days ago
                    </p>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="negative">
                <ul className="space-y-4">
                  <li className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">
                      "The app crashes frequently when I try to save large
                      files. This is a major issue for my work."
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      - Mike Johnson, 1 day ago
                    </p>
                  </li>
                  <li className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">
                      "The latest update removed a feature I used daily. Please
                      bring it back or provide an alternative."
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      - Sarah Brown, 4 days ago
                    </p>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Analytics | Unecho" }];
};
