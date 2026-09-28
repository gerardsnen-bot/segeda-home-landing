#!/usr/bin/env bash
set -euo pipefail

: "${VITE_SUPABASE_PUBLISHABLE_KEY:?Missing VITE_SUPABASE_PUBLISHABLE_KEY}"
endpoint="https://vrusfoxihkjywmvdveoy.supabase.co/functions/v1/migrate-product-images"

for batch in $(seq 1 40); do
  response=$(curl -fsS --max-time 120 -X POST "$endpoint" \
    -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY" \
    -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
    -H "Content-Type: application/json" \
    --data '{"limit":25}')
  processed=$(jq -r '.processed // 0' <<<"$response")
  migrated=$(jq -r '.migrated // 0' <<<"$response")
  skipped=$(jq -r '.skipped // 0' <<<"$response")
  failed=$(jq -r '.failed // 0' <<<"$response")
  printf 'batch=%s processed=%s migrated=%s skipped=%s failed=%s\n' "$batch" "$processed" "$migrated" "$skipped" "$failed"
  if [[ "$failed" != "0" ]]; then
    jq -c '.results[] | select(.status == "failed")' <<<"$response"
  fi
  if [[ "$processed" == "0" ]]; then
    exit 0
  fi
  sleep 0.3
done

echo "Migration stopped after the bounded 40-batch run." >&2
exit 2
