import assert from "node:assert/strict";
import test from "node:test";

import { assertAdminAuthConfigured, AuthConfigurationError } from "@/lib/auth";
import {
  hasStorageEnv,
  hasSupabaseAssetStorageEnv,
  shouldFailClosedForAdminAuth,
} from "@/lib/env";

function withEnv(overrides: Record<string, string | undefined>, callback: () => void) {
  const original = Object.fromEntries(
    Object.keys(overrides).map((key) => [key, process.env[key]]),
  );

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    callback();
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test("production auth fails closed when browser auth env is missing", () => {
  withEnv(
    {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    },
    () => {
      assert.equal(shouldFailClosedForAdminAuth("production", false), true);
      assert.throws(() => assertAdminAuthConfigured(), AuthConfigurationError);
    },
  );
});

test("development does not fail closed when browser auth env is missing", () => {
  withEnv(
    {
      NODE_ENV: "development",
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    },
    () => {
      assert.equal(shouldFailClosedForAdminAuth("development", false), false);
      assert.doesNotThrow(() => assertAdminAuthConfigured());
    },
  );
});

test("Supabase asset storage counts as production storage when configured", () => {
  withEnv(
    {
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-placeholder",
      SUPABASE_ASSET_BUCKET: "scheduler-assets",
      ASSET_PUBLIC_BASE_URL:
        "https://project.supabase.co/storage/v1/object/public/scheduler-assets",
      R2_ACCOUNT_ID: undefined,
      R2_ACCESS_KEY_ID: undefined,
      R2_SECRET_ACCESS_KEY: undefined,
      R2_BUCKET: undefined,
      AWS_ACCESS_KEY_ID: undefined,
      AWS_SECRET_ACCESS_KEY: undefined,
      AWS_REGION: undefined,
      AWS_S3_BUCKET: undefined,
    },
    () => {
      assert.equal(hasSupabaseAssetStorageEnv(), true);
      assert.equal(hasStorageEnv(), true);
    },
  );
});
