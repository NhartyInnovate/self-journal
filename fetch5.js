async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product?t=123456789', {
    headers: {
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  console.log('Body:', (await res.text()).substring(0, 50));
}
run();
