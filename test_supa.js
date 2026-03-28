const url = 'https://wreovuejotnudkpaaffz.supabase.co/rest/v1/church_info?select=organization_id&limit=1';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZW92dWVqb3RudWRrcGFhZmZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg4NzAzMywiZXhwIjoyMDg0NDYzMDMzfQ.pG-Nhxt-Hdm8AzJ5Z9qToTX_EWrlAlmCDO3RDtKW-P4';

async function test() {
  const res = await fetch(url, { headers: { 'apikey': apikey, 'Authorization': `Bearer ${apikey}` } });
  const data = await res.json();
  if (!data || data.length === 0) return console.log("No data");
  
  const orgId = data[0].organization_id;

  const updateUrl = `https://wreovuejotnudkpaaffz.supabase.co/rest/v1/church_info?organization_id=eq.${orgId}`;
  
  // Try dummy update matching what the route does
  const payload = {
    tithely_url: "https://test.com/123",
    name_en: "Test Name",
    name_es: "Test Name",
  };

  const updateRes = await fetch(updateUrl, {
    method: 'PATCH',
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });

  const updateData = await updateRes.json();
  if (updateRes.ok) {
    console.log("SUCCESS:", updateData);
  } else {
    console.log("ERROR STATUS:", updateRes.status);
    console.log("ERROR from Supabase:", updateData);
  }
}
test().catch(console.error);
