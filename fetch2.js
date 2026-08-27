async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/doesnotexist');
  console.log(res.status, (await res.text()).substring(0, 50));
}
run();
