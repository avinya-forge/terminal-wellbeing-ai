#!/usr/bin/env bash
# run.sh - Unified execution script

set -e

case "${1:-}" in
    --start)
        echo "LAUNCH: Environment init..."
        npm install
        # Idempotency: kill existing process on Vite default port (5173) before starting
        kill $(lsof -t -i :5173) 2>/dev/null || true
        # Also clean up any existing instances of "npm run dev"
        pkill -f "vite" 2>/dev/null || true
        npm run dev > vite_output.log 2>&1 &
        ;;
    --test)
        echo "VERIFY: Running lint, coverage, and unit tests..."
        npm run lint || true
        npm run test:coverage || true
        ;;
    --backlog)
        echo "AUDIT: Grep TASK/DEBT + recursive expansion..."
        grep -rE "\[TASK\]|\[DEBT\]|\[RESOLVE\]|\[HIGH-RISK\]" docs/ || true
        ;;
    --skills)
        echo "EVOLVE: Self-update logic using skills.sh patterns..."
        curl -s https://skills.sh/ | grep -o '"skillId":"[^"]*"' | head -n 5 || true
        ;;
    *)
        echo "Usage: ./run.sh [--start|--test|--backlog|--skills]"
        ;;
esac
