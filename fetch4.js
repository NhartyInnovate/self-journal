async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product', {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  });
  console.log('Status:', res.status);
  console.log('Body:', (await res.text()).substring(0, 50));
}
run();
