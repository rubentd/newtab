const randomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);

const quoteIndex = randomInRange(0, window.quotes.length - 1);
const quote = window.quotes[quoteIndex];

const quoteText = quote.quotes[randomInRange(0, quote.quotes.length - 1)];
 
document.getElementById('quote_text').innerHTML = quoteText;
document.getElementById('quote_credit').innerHTML = quote.title;
