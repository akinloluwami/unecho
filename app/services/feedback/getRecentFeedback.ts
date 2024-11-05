import { prisma } from "prisma/client";

export const getRecentFeedback = async (projectId: string, userId: string) => {
  const feedback = await prisma.feedback.findMany({
    where: {
      project: {
        id: projectId,
        userId,
      },
    },
    include: {
      clientUserProfile: true,
    },
    take: 10,
  });

  const data = feedback.map((f) => ({
    id: f.id,
    user: f.clientUserProfile?.name,
    sentiment: f.sentiment,
    feedback: f.content,
    date: new Date(f.createdAt).toLocaleDateString(),
  }));

  return data;
};
