async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/product');
  console.log(res.status, await res.text());
}
run();
