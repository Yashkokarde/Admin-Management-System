#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

mvn -f Selenium258-main/pom.xml -q dependency:resolve test-compile
