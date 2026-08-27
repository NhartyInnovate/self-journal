async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/admin/stats');
  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Body:', (await res.text()).substring(0, 100));
}
run();
