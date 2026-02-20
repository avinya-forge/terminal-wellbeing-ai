/**
 * Handle the breathe command to guide the user through a breathing exercise
 */
export async function handleBreatheCommand(): Promise<string> {
  return `Let's practice the 4-7-8 breathing technique to reduce anxiety.

1. Close your mouth and inhale quietly through your nose to a mental count of 4.
2. Hold your breath for a count of 7.
3. Exhale completely through your mouth, making a whoosh sound to a count of 8.

Repeat this cycle three more times.

Remember:
- Keep the tip of your tongue against the ridge of tissue just behind your upper front teeth.
- Exhale through your mouth around your tongue.

(Take your time. I'm here when you're ready.)`;
}
