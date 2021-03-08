// Display quote

const randomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);

const quoteIndex = randomInRange(0, window.quotes.length - 1);
const quote = window.quotes[quoteIndex];

const quoteText = quote.quotes[randomInRange(0, quote.quotes.length - 1)];
 
document.getElementById('quote_text').innerHTML = quoteText;
document.getElementById('quote_credit').innerHTML = quote.title;

// Load hacker news

const loadTopStories = async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  return await response.json();
}

const loadStory = async (storyId) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
  return await response.json();
}

const renderStories = (stories) => {
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

const NUMBER_STORIES = 16;

const displayStories = async () => {
  const todayKey = 'stories' + new Date().toDateString()
  let stories = [];
  const cacheStories = localStorage.getItem(todayKey);
  if (cacheStories) {
    stories = JSON.parse(cacheStories);
  } else {
    localStorage.clear();
    const ids = await loadTopStories();
    for (let i = 0; i < NUMBER_STORIES; i++) {
      stories.push(await loadStory(ids[i]));
    }
    localStorage.setItem(todayKey, JSON.stringify(stories));
  }
  renderStories(stories);
}

displayStories();
