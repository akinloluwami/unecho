import { prisma } from "prisma/client";
import dayjs from "dayjs";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getWeeklyFeedbackChartData = async (
  projectId: string,
  userId: string
) => {
  const startOfWeek = dayjs().startOf("week").toDate();

  const feedbackThisWeek = await prisma.feedback.findMany({
    where: {
      project: {
        id: projectId,
        userId,
      },
      createdAt: {
        gte: startOfWeek,
      },
    },
  });

  const weeklyData = new Map<
    string,
    { positive: number; neutral: number; negative: number }
  >();

  weekdays.forEach((day) => {
    weeklyData.set(day, { positive: 0, neutral: 0, negative: 0 });
  });

  feedbackThisWeek.forEach((feedback) => {
    const dayName = weekdays[dayjs(feedback.createdAt).day()];
    const sentimentCounts = weeklyData.get(dayName);

    if (sentimentCounts) {
      switch (feedback.sentiment) {
        case "positive":
          sentimentCounts.positive += 1;
          break;
        case "neutral":
          sentimentCounts.neutral += 1;
          break;
        case "negative":
          sentimentCounts.negative += 1;
          break;
      }
    }
  });

  const chartData = Array.from(weeklyData.entries()).map(([day, counts]) => ({
    name: day,
    ...counts,
  }));

  return chartData;
};
