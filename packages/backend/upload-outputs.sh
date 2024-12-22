#!/bin/bash

die () {
  echo $1
  exit 1
}

bucket=$(cat outputs.json | jq -r '.[keys[0]] | with_entries(if (.key|test("^.*frontendBucketName$")) then ( {key: "frontendBucketName", value: .value } ) else empty end ) | .frontendBucketName')

[ -n "$bucket" ] || die "could not determine bucket name"

aws s3 cp outputs.json s3://${bucket}/

distribution=$(cat outputs.json | jq -r '.[keys[0]] | with_entries(if (.key|test("^.*frontendDistributionId$")) then ( {key: "frontendDistributionId", value: .value } ) else empty end ) | .frontendDistributionId')

[ -n "$distribution" ] || die "could not determine distribution id"

aws cloudfront create-invalidation --distribution-id ${distribution} --paths "/outputs.json"
