async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product', {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    }
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 100));
}
run();
