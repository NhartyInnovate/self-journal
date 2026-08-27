async function run() {
  const res = await fetch('https://self-journal-eight.vercel.app/api/admin/auth/me');
  console.log('Status:', res.status);
  console.log('Body:', (await res.text()).substring(0, 100));
}
run();
