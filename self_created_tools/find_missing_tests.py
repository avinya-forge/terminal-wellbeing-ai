import sys
import os
import json
import subprocess

def main():
    try:
        output = subprocess.check_output(['npm', 'run', 'test:coverage', '--', '--coverageReporters=json-summary', '--watchAll=false'], stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print(f"Tests failed, but checking coverage anyway. Output: {e.output.decode('utf-8')[:500]}")

    with open('coverage/coverage-summary.json') as f:
        data = json.load(f)

    print("Files with < 95% statement coverage:")
    for file, coverage in data.items():
        if file != 'total':
            if coverage['statements']['pct'] < 95:
                print(f"{file.replace(os.getcwd() + '/', '')}: {coverage['statements']['pct']}%")

if __name__ == '__main__':
    main()
