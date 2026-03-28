const url = 'https://wreovuejotnudkpaaffz.supabase.co/rest/v1/church_info?select=*&limit=1';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZW92dWVqb3RudWRrcGFhZmZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg4NzAzMywiZXhwIjoyMDg0NDYzMDMzfQ.pG-Nhxt-Hdm8AzJ5Z9qToTX_EWrlAlmCDO3RDtKW-P4';

async function test() {
  const res = await fetch(url, { headers: { 'apikey': apikey, 'Authorization': `Bearer ${apikey}` } });
  const data = await res.json();
  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    console.log("No data");
  }
}
test().catch(console.error);
