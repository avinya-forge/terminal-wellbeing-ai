export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "You are enough just as you are.", author: "Meghan Markle" },
  { text: "It’s okay to not be okay as long as you are not giving up.", author: "Karen Salmansohn" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Never bend your head. Always hold it high. Look the world straight in the eye.", author: "Helen Keller" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.", author: "Jimmy Dean" },
  { text: "No matter what you're going through, there's a light at the end of the tunnel.", author: "Demi Lovato" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { text: "You do not find the happy life. You make it.", author: "Camilla Eyring Kimball" },
  { text: "Happiness is not by chance, but by choice.", author: "Jim Rohn" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The bad news is time flies. The good news is you're the pilot.", author: "Michael Altshuler" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Try to be a rainbow in someone else's cloud.", author: "Maya Angelou" },
  { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
  { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang Von Goethe" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Security is mostly a superstition. Life is either a daring adventure or nothing.", author: "Helen Keller" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Do what you can with all you have, wherever you are.", author: "Theodore Roosevelt" },
  { text: "You are the master of your destiny. You can influence, direct and control your own environment. You can make your life what you want it to be.", author: "Napoleon Hill" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "To handle yourself, use your head; to handle others, use your heart.", author: "Eleanor Roosevelt" },
  { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "We can't help everyone, but everyone can help someone.", author: "Ronald Reagan" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { text: "When you have a dream, you've got to grab it and never let go.", author: "Carol Burnett" },
  { text: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.", author: "Jimmy Dean" },
  { text: "No matter what you're going through, there's a light at the end of the tunnel.", author: "Demi Lovato" },
  { text: "Just when the caterpillar thought the world was ending, he turned into a butterfly.", author: "Proverb" },
  { text: "Thinking: the talking of the soul with itself.", author: "Plato" },
  { text: "The power of imagination makes us infinite.", author: "John Muir" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", author: "Helen Keller" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "May your choices reflect your hopes, not your fears.", author: "Nelson Mandela" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" }
];

export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
