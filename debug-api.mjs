const response = await fetch(
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json"
);
const data = await response.json();

console.log(`Total skins: ${data.length}`);
console.log("\nFirst skin structure:");
console.log(JSON.stringify(data[0], null, 2));

console.log("\nSearching for 'Asiimov':");
const asiimov = data.find(s => s.name?.includes("Asiimov"));
if (asiimov) {
  console.log(`Found: ${asiimov.weapon?.name} | ${asiimov.name}`);
  console.log(`Image: ${asiimov.image?.substring(0, 50)}...`);
} else {
  console.log("Not found");
}

console.log("\nFirst 10 skins with images:");
let count = 0;
for (const skin of data) {
  if (skin.image && skin.weapon?.name && skin.name && count < 10) {
    console.log(`${skin.weapon.name} | ${skin.name}`);
    count++;
  }
}
