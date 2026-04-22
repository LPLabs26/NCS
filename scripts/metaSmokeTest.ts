import { smokeTestMetaConnection } from "@/lib/meta/instagram";
import { printCheck, printHeading, type CheckLine } from "@/scripts/_socialCli";

function buildMetaGuidance(errors: string[]): string[] {
  const guidance = [
    "Instagram must be a Professional account.",
    "Instagram must be connected to the correct Facebook Page.",
    "The access token needs the required Instagram Graph permissions.",
    "The access token may be expired and need to be refreshed.",
    "IG_USER_ID may be incorrect for the connected Page.",
  ];

  if (errors.some((error) => /permission|access token/i.test(error))) {
    guidance.unshift("Re-check Meta app permissions and token scopes first.");
  }

  return guidance;
}

async function main() {
  const result = await smokeTestMetaConnection();
  const lines: CheckLine[] = [];

  if (!result.configured) {
    lines.push({
      level: "FAIL",
      label: "Meta environment",
      message:
        "Missing required Meta variables. Add META_API_VERSION, META_APP_ID, META_APP_SECRET, PAGE_ID, IG_USER_ID, and PAGE_ACCESS_TOKEN.",
    });
  } else if (!result.ok) {
    lines.push({
      level: "FAIL",
      label: "Meta connection",
      message: result.errors[0] ?? "Meta account could not be verified.",
    });
  } else {
    lines.push({
      level: "PASS",
      label: "Meta connection",
      message: "Facebook Page and Instagram account are reachable without publishing anything.",
    });
  }

  printHeading("Meta Smoke Test");
  lines.forEach(printCheck);

  if (result.details.length > 0) {
    console.log("\nDetails:");
    result.details.forEach((detail) => console.log(`- ${detail}`));
  }

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach((error) => console.log(`- ${error}`));
    console.log("\nCommon fixes:");
    buildMetaGuidance(result.errors).forEach((item) => console.log(`- ${item}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
