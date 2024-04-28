// Display quote

const NEWS_API_KEY = 'SHc1j1x5kUSftAimEtR66pDWM9ulBvARV5oN3hKc'
const NUMBER_STORIES = 18;

const deleteKeys = (key) => {
  Object.keys(localStorage)
    .filter(x => x.startsWith(key))
    .forEach(x => localStorage.removeItem(x))
}

const randomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);

const randomQuote = () => {
  const todayKey = 'quote_' + new Date().toDateString();
  const cachedQuote = localStorage.getItem(todayKey);
  if (cachedQuote) {
    return JSON.parse(cachedQuote);
  } else {
    deleteKeys('quote');

    const plainQuotes = quotes.reduce((acc, quote) => (
      acc.concat(quote.quotes.map(q => ({
          title: quote.title,
          text: q,
        }
      )))
    ), []);

    const randomQuote = plainQuotes[randomInRange(0, plainQuotes.length - 1)];
    localStorage.setItem(todayKey, JSON.stringify(randomQuote));
    return randomQuote;
  }
}

const loadHNTopStories = async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  return await response.json();
}

const loadHNStory = async (storyId) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
  return await response.json();
}

const renderHNStories = (stories) => {
  document.getElementById('hackernews').innerHTML = '';
  for (let story of stories) {
    document.getElementById('hackernews').innerHTML += `
      <li>
        <a href="${story.url}" target="_blank">${story.title}</a>
        <span>(${story.by})</span>
      </li>
    `;
  }
}

const getHNStories = async () => {
  const date = new Date();
  const todayKey = 'stories_' + date.toDateString() + date.getHours();
  let stories = [];
  const cacheStories = localStorage.getItem(todayKey);
  if (cacheStories) {
    stories = JSON.parse(cacheStories);
  } else {
    deleteKeys('stories');
    const ids = await loadHNTopStories();
    for (let i = 0; i < NUMBER_STORIES; i++) {
      stories.push(await loadHNStory(ids[i]));
    }
    localStorage.setItem(todayKey, JSON.stringify(stories));
  }
  return stories;
}

function randomReminder() {
  const todayKey = 'reminder_' + new Date().toDateString();
  const cachedReminder = localStorage.getItem(todayKey);
  if (cachedReminder) {
    return JSON.parse(cachedReminder);
  } else {
    deleteKeys('reminder');

    const reminder = window.reminders[randomInRange(0, window.reminders.length - 1)];
    localStorage.setItem(todayKey, JSON.stringify(reminder));
    return reminder;
  }
}

async function main() {
  const stories = await getHNStories();
  renderHNStories(stories);

  const quote = randomQuote();
  document.getElementById('quote_text').innerHTML = quote.text;
  document.getElementById('quote_credit').innerHTML = quote.title;

  const reminder = randomReminder();
  document.getElementById('reminder').innerHTML = reminder;
}


main()
