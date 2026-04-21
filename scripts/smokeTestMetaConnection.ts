import { smokeTestMetaConnection } from "@/lib/meta/instagram";

async function main() {
  const result = await smokeTestMetaConnection();

  if (result.ok) {
    console.log("Meta smoke test passed.");
    result.details.forEach((detail) => console.log(`- ${detail}`));
    return;
  }

  console.error("Meta smoke test failed.");
  result.errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

