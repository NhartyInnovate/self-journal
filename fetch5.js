async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product', {
    headers: { 'Accept': 'application/json' }
  });
  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Body:', (await res.text()).substring(0, 50));
}
run();
