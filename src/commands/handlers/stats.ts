import { Message } from "../../types/Message";
import { ParsedCommand } from "../../utils/commandParser";
import { analyzeSentiment, calculateMoodTrend, extractTopics } from "../../utils/analysis";

export async function handleStatsCommand(parsed: ParsedCommand, messages: Message[]): Promise<string> {
  const userMessages = messages.filter(m => m.sender === 'user');
  const aiMessages = messages.filter(m => m.sender === 'bot');

  if (userMessages.length === 0) {
    return "Not enough data to generate statistics. Keep chatting!";
  }

  // Calculate session duration
  const firstMsg = messages[0];
  const lastMsg = messages[messages.length - 1];
  const startTime = new Date(firstMsg.timestamp).getTime();
  const endTime = new Date(lastMsg.timestamp).getTime();
  const durationMinutes = Math.round((endTime - startTime) / 60000);

  // Sentiment Analysis
  const sentiments = userMessages.map(m => analyzeSentiment(m.content));
  const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
  const moodTrend = calculateMoodTrend(sentiments);

  let moodDescription = "Neutral";
  if (avgSentiment > 0.3) moodDescription = "Generally Positive";
  else if (avgSentiment < -0.3) moodDescription = "Generally Negative";

  // Simple word count
  const totalWords = userMessages.reduce((acc, m) => acc + m.content.split(/\s+/).length, 0);

  // Topic Extraction
  const allTopics: string[] = [];
  userMessages.forEach(m => {
    const topics = extractTopics(m.content);
    allTopics.push(...topics);
  });

  const topicCounts: Record<string, number> = {};
  allTopics.forEach(t => {
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  });

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t, c]) => `${t} (${c})`);

  const topicsStr = sortedTopics.length > 0 ? sortedTopics.join(', ') : "None detected";

  return `Session Statistics:
-------------------
Duration: ${durationMinutes} minutes
Messages: ${messages.length} (${userMessages.length} You, ${aiMessages.length} AI)
Words Typed: ${totalWords}

Mood Analysis:
-------------
Average Sentiment: ${avgSentiment.toFixed(2)} (${moodDescription})
Mood Trend: ${moodTrend}

Top Topics:
----------
${topicsStr}`;
}
