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
        grep -rE "\[EPIC\]|\[DEBT\]" docs/ || true
        ;;
    --skills)
        echo "EVOLVE: Self-update logic using skills.sh patterns..."
        # Extract skills and format them appropriately
        skills_output=$(curl -s https://skills.sh/ | grep -o '"skillId":"[^"]*"' | cut -d'"' -f4 | head -n 5)
        if [ -n "$skills_output" ]; then
            echo "Latest skills extracted:"
            echo "$skills_output"
            # Idempotent injection of skills
            if ! grep -q "## Skills Patterns" docs/engineering/conventions.md; then
                echo -e "\n## Skills Patterns\n$skills_output" >> docs/engineering/conventions.md
            fi
        else
             echo "Failed to fetch skills."
        fi
        ;;

    --sync)
        echo "SYNC: Idempotent file-tree alignment..."
        mkdir -p docs/planning docs/architecture docs/engineering
        for file in docs/planning/roadmap.md docs/architecture/system-design.md docs/engineering/conventions.md; do
            if [ ! -f "$file" ] || [ ! -s "$file" ] || [ "$(wc -l < "$file")" -le 1 ]; then
                title=$(basename "$file" .md)
                echo -e "# ${title}\n\n## Overview\n\n## Details\n" > "$file"
            fi
        done
        ;;
    *)
        echo "Usage: ./run.sh [--start|--test|--backlog|--skills|--sync]"
        ;;
esac
