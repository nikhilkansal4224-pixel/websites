const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

async function fetchSiteData(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 8000
    });
    
    const $ = cheerio.load(data);
    
    // Auto-extract title from OpenGraph tag or standard <title> tag
    const title = $('meta[property="og:title"]').attr('content') || 
                  $('title').text() || 
                  new URL(url).hostname;

    // Auto-extract description from meta tags
    const description = $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="description"]').attr('content') || 
                        'No description available.';

    // Auto-generate screenshot using a free image screenshot service
    const screenshot = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

    return {
      title: title.trim(),
      description: description.trim(),
      url,
      screenshot
    };
  } catch (error) {
    console.error(`Failed to fetch metadata for ${url}:`, error.message);
    return {
      title: new URL(url).hostname,
      description: 'Automated entry - metadata could not be fetched.',
      url,
      screenshot: `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    };
  }
}

async function main() {
  const siteData = [];
  for (const url of urls) {
    console.log(`Processing: ${url}`);
    const data = await fetchSiteData(url);
    siteData.push(data);
  }

  fs.writeFileSync('data.json', JSON.stringify(siteData, null, 2));
  console.log('Successfully generated data.json!');
}

main();
