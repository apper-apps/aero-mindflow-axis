const mockQuotes = [
  // Mindfulness
  {
    Id: 1,
    text: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    category: "mindfulness"
  },
  {
    Id: 2,
    text: "Mindfulness is about being fully awake in our lives. It is about perceiving the exquisite vividness of each moment.",
    author: "Jon Kabat-Zinn",
    category: "mindfulness"
  },
  {
    Id: 3,
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "mindfulness"
  },
  {
    Id: 4,
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindfulness"
  },
  
  // Gratitude
  {
    Id: 5,
    text: "Gratitude turns what we have into enough.",
    author: "Anonymous",
    category: "gratitude"
  },
  {
    Id: 6,
    text: "The unthankful heart discovers no mercies; but the thankful heart will find, in every hour, some heavenly blessings.",
    author: "Henry Ward Beecher",
    category: "gratitude"
  },
  {
    Id: 7,
    text: "Gratitude is not only the greatest of virtues, but the parent of all others.",
    author: "Cicero",
    category: "gratitude"
  },
  {
    Id: 8,
    text: "Be thankful for what you have; you'll end up having more.",
    author: "Oprah Winfrey",
    category: "gratitude"
  },
  
  // Success
  {
    Id: 9,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    Id: 10,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "success"
  },
  {
    Id: 11,
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett",
    category: "success"
  },
  {
    Id: 12,
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    category: "success"
  },
  
  // Compassion
  {
    Id: 13,
    text: "Compassion is the radicalism of our time.",
    author: "Dalai Lama",
    category: "compassion"
  },
  {
    Id: 14,
    text: "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.",
    author: "Dalai Lama",
    category: "compassion"
  },
  {
    Id: 15,
    text: "The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.",
    author: "Mahatma Gandhi",
    category: "compassion"
  },
  {
    Id: 16,
    text: "Compassion is not religious business, it is human business, it is not luxury, it is essential for our own peace and mental stability.",
    author: "Dalai Lama",
    category: "compassion"
  },
  
  // Motivation
  {
    Id: 17,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation"
  },
  {
    Id: 18,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation"
  },
  {
    Id: 19,
    text: "Your limitation—it's only your imagination.",
    author: "Anonymous",
    category: "motivation"
  },
  {
    Id: 20,
    text: "Great things never come from comfort zones.",
    author: "Anonymous",
    category: "motivation"
  },
  
  // Wisdom
  {
    Id: 21,
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "wisdom"
  },
  {
    Id: 22,
    text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    author: "Bill Keane",
    category: "wisdom"
  },
  {
    Id: 23,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "wisdom"
  },
  {
    Id: 24,
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "wisdom"
  }
];

// Get daily quote that remains consistent throughout the day
export const getDailyQuote = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = seed % mockQuotes.length;
      resolve(mockQuotes[index]);
    }, 300);
  });
};

export const getQuotesByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredQuotes = mockQuotes.filter(quote => quote.category === category);
      resolve([...filteredQuotes]);
    }, 200);
  });
};

export const getAllQuotes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockQuotes]);
    }, 200);
  });
};

const quotesService = {
  getDailyQuote,
  getQuotesByCategory,
  getAllQuotes
};

export default quotesService;