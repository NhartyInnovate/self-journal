async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product');
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 100));
}
run();
