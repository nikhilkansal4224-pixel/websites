const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Ensure string is a valid URL by prepending protocol if omitted
function normalizeUrl(rawUrl) {
  let formatted = rawUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }
  return formatted;
}

const rawUrls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

async function fetchSiteData(rawUrl) {
  const url = normalizeUrl(rawUrl);
  let hostname = url;

  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    console.error(`Invalid URL provided: ${rawUrl}`);
  }

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 8000
    });

    const $ = cheerio.load(data);

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      hostname;

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      'No description available.';

    const screenshot = `https://api.microlink.io/?url=${encodeURIComponent(
      url
    )}&screenshot=true&meta=false&embed=screenshot.url`;

    return {
      title: title.trim(),
      description: description.trim(),
      url,
      screenshot
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error.message);
    return {
      title: hostname,
      description: 'Automated entry - metadata could not be fetched.',
      url,
      screenshot: `https://api.microlink.io/?url=${encodeURIComponent(
        url
      )}&screenshot=true&meta=false&embed=screenshot.url`
    };
  }
}

async function main() {
  const siteData = [];
  for (const rawUrl of rawUrls) {
    console.log(`Processing: ${rawUrl}`);
    const data = await fetchSiteData(rawUrl);
    siteData.push(data);
  }

  fs.writeFileSync('data.json', JSON.stringify(siteData, null, 2));
  console.log('Successfully generated data.json!');
}

main();
