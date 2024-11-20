import { prisma } from "prisma/client";
import dayjs from "dayjs";

function adjustPercentagesToHundred(
  sentimentPercentages: Array<{
    sentiment: string;
    percentage: number;
    changeFromLastWeek: number;
  }>
) {
  let roundedPercentages = sentimentPercentages.map((item) => ({
    ...item,
    roundedPercentage: Math.round(item.percentage),
  }));

  let totalRounded = roundedPercentages.reduce(
    (sum, item) => sum + item.roundedPercentage,
    0
  );

  const difference = 100 - totalRounded;

  roundedPercentages = roundedPercentages.map((item, index) => {
    if (index < Math.abs(difference)) {
      return {
        ...item,
        roundedPercentage: item.roundedPercentage + Math.sign(difference),
      };
    }
    return item;
  });

  return roundedPercentages.map((item) => ({
    sentiment: item.sentiment,
    percentage: item.roundedPercentage,
    changeFromLastWeek: item.changeFromLastWeek,
  }));
}

export const getFeedbackSentimentData = async (
  projectId: string,
  userId: string
) => {
  const startOfThisWeek = dayjs().startOf("week").toDate();
  const startOfLastWeek = dayjs(startOfThisWeek).subtract(1, "week").toDate();

  const totalFeedbackCountThisWeek = await prisma.feedback.count({
    where: {
      projectId,
      project: { userId },
      createdAt: {
        gte: startOfThisWeek,
      },
    },
  });

  const totalFeedbackCountLastWeek = await prisma.feedback.count({
    where: {
      projectId,
      project: { userId },
      createdAt: {
        gte: startOfLastWeek,
        lt: startOfThisWeek,
      },
    },
  });

  const sentimentsThisWeek = await prisma.feedback.groupBy({
    by: ["sentiment"],
    where: {
      projectId,
      project: { userId },
      createdAt: {
        gte: startOfThisWeek,
      },
    },
    _count: {
      sentiment: true,
    },
  });

  const sentimentsLastWeek = await prisma.feedback.groupBy({
    by: ["sentiment"],
    where: {
      projectId,
      project: { userId },
      createdAt: {
        gte: startOfLastWeek,
        lt: startOfThisWeek,
      },
    },
    _count: {
      sentiment: true,
    },
  });

  const defaultSentiments = ["positive", "negative", "neutral"];

  const lastWeekCounts = defaultSentiments.reduce(
    (acc, sentiment) => {
      const sentimentData = sentimentsLastWeek.find(
        (data) => data.sentiment === sentiment
      );
      acc[sentiment] = sentimentData ? sentimentData._count.sentiment : 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const sentimentData = defaultSentiments.map((sentiment) => {
    const thisWeekData = sentimentsThisWeek.find(
      (data) => data.sentiment === sentiment
    );
    const thisWeekCount = thisWeekData ? thisWeekData._count.sentiment : 0;

    const thisWeekPercentage =
      totalFeedbackCountThisWeek > 0
        ? (thisWeekCount / totalFeedbackCountThisWeek) * 100
        : 0;

    const lastWeekCount = lastWeekCounts[sentiment];
    const lastWeekPercentage =
      totalFeedbackCountLastWeek > 0
        ? (lastWeekCount / totalFeedbackCountLastWeek) * 100
        : 0;

    const percentageChange = thisWeekPercentage - lastWeekPercentage;

    return {
      sentiment,
      percentage: parseFloat(thisWeekPercentage.toFixed(2)),
      changeFromLastWeek: parseFloat(percentageChange.toFixed(2)),
    };
  });

  const adjustedSentimentData = adjustPercentagesToHundred(sentimentData);

  const data = adjustedSentimentData.reduce(
    (acc, item) => {
      acc[item.sentiment] = {
        percentage: item.percentage,
        changeFromLastWeek: item.changeFromLastWeek,
      };
      return acc;
    },
    {} as Record<string, { percentage: number; changeFromLastWeek: number }>
  );

  return data;
};
