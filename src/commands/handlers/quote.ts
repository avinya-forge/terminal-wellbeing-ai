import { getRandomQuote } from "../../data/quotes";

/**
 * Handle the quote command to display a motivational quote
 */
export async function handleQuoteCommand(): Promise<string> {
  const quote = getRandomQuote();
  return `"${quote.text}"\n\n— ${quote.author}`;
}
