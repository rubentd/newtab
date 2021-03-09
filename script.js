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
  const date = new Date();
  const todayKey = 'stories' + date.toDateString() + date.getHours();
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

// load decrypt

const loadDecryptStories = async () => {
  const res = await window.fetch('https://api.decrypt.co/content/posts?_minimal=true&category=news&lang=en-US&offset=0&order=desc&orderby=date&per_page=12');
  return await res.json();
}

const renderDecryptStories = (stories) => {
  document.getElementById('decryptnews').innerHTML = '';
  for (let story of stories) {
    document.getElementById('decryptnews').innerHTML += `
      <li>
        <a href="${story.link}" target="_blank">
          <img src="${story.custom_fields.featured_image_url}" alt="${story.custom_fields.featured_image_description}" />
        </a>
        <a class="overlay" href="${story.link}" target="_blank">${story.title.rendered}</a>
      </li>
    `;
  }
}

const displayDecryptStories = async () => {
  const date = new Date();
  const todayKey = 'decrypt_stories' + date.toDateString() + date.getHours();
  console.log(todayKey);
  let stories = [];
  const cacheStories = localStorage.getItem(todayKey);
  if (cacheStories) {
    stories = JSON.parse(cacheStories);
  } else {
    localStorage.clear();
    const stories = await loadDecryptStories();
    localStorage.setItem(todayKey, JSON.stringify(stories));
  }
  renderDecryptStories(stories);
}

displayDecryptStories();

// load crypto prices

const loadCrypto = () => {
  const e = crCryptocoinPriceWidget.init({base:"USD",items:"BTC,ETH",backgroundColor:"FFFFFF",streaming:"1",rounded:"1",boxShadow:"1",border:"1"});
  document.getElementById('coindata').append(e);
};

loadCrypto();