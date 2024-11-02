import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  Menu,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AppHeader from "~/components/app-header";

// Mock data for charts
const sentimentTrendData = [
  { name: "Week 1", positive: 65, neutral: 25, negative: 10 },
  { name: "Week 2", positive: 60, neutral: 30, negative: 10 },
  { name: "Week 3", positive: 70, neutral: 20, negative: 10 },
  { name: "Week 4", positive: 75, neutral: 15, negative: 10 },
];

const feedbackVolumeData = [
  { name: "Mon", volume: 120 },
  { name: "Tue", volume: 150 },
  { name: "Wed", volume: 180 },
  { name: "Thu", volume: 190 },
  { name: "Fri", volume: 160 },
  { name: "Sat", volume: 140 },
  { name: "Sun", volume: 130 },
];

const feedbackCategoryData = [
  { name: "UI/UX", value: 400 },
  { name: "Performance", value: 300 },
  { name: "Features", value: 300 },
  { name: "Bugs", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="">
      <AppHeader title="Analytics" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
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
              <div className="text-2xl font-bold">7.8</div>
              <p className="text-xs text-muted-foreground">
                +0.3 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Rate
              </CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response Time
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4h 32m</div>
              <p className="text-xs text-muted-foreground">
                -12m from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
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

        <Card>
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
        </Card>
      </div>
    </div>
  );
}
