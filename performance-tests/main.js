const { execSync } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

const subfolder = "benchmark_files";
const filePath = path.join(subfolder, "timestamps.txt");

const delayBetweenScripts = 500; // Change this to adjust the delay between scripts
let numberOfCycles = 5; // Change this to adjust the number of cycles

const scripts = [
  "01_NativeStart",
  "02_hotkey_monitor",
  "03_hotkey_run",
  "03_hotkeylessAHK_monitor_for_request",
  "04_hotkeylessAHK_request",
].map((name, i) => ({ name: `${name}.ahk`, delay: delayBetweenScripts + (i % 2) * delayBetweenScripts }));

async function deleteFile(path) {
  try {
    await fs.unlink(path);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let completedScripts = 0;

const friendlyNames = {
  "01_NativeStart.ahk": "Calling AHK files directly",
  "02_hotkey_monitor.ahk": "Hotkey Listener",
  "03_hotkey_run.ahk": "Hotkey Pressed",
  "03_hotkeylessAHK_monitor_for_request.ahk": "Hotkeyless AHK Listener",
  "04_hotkeylessAHK_request.ahk": "Hotkeyless AHK Request Sent",
};

async function runScript(script) {
  execSync(`start "" ${path.join(subfolder, script.name)}`, {
    stdio: "inherit",
  });
  await sleep(script.delay);
  completedScripts++;
  const percentageCompleted = ((completedScripts / (numberOfCycles * scripts.length)) * 100).toFixed(2);
  console.log(`Completed ${friendlyNames[script.name] || script.name}. Progress: ${percentageCompleted}%`);
}

async function runScripts() {
  console.log("Please ensure that AutoHotkey and the server are shut down before proceeding.");
  console.log("Start the backend server with 'node index.js' from the 'files/dist' folder.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Proceed with the benchmark? (Y/N): `, async (answer) => {
    if (answer.toUpperCase() === "Y") {
      rl.question(`Enter the number of cycles (default: ${numberOfCycles}): `, async (answer) => {
        numberOfCycles = parseInt(answer) || numberOfCycles;
        console.log(`Number of cycles: ${numberOfCycles}`);
        await deleteFile(filePath); // Delete the file once before the cycles start
        for (let cycle = 0; cycle < numberOfCycles; cycle++) {
          console.log(`RUNNING CYCLE ${cycle + 1}`);
          for (const script of scripts) await runScript(script);
        }
        console.log("Benchmark Complete");
        await readResults();

        rl.close();
      });
    } else {
      console.log("Benchmark aborted.");
      rl.close();
    }
  });
}

async function readResults() {
  await sleep(2000); // Add a delay of 2000 milliseconds (2 seconds)

  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.split("\n");
    const startTimes = {},
      results = {};

    for (let line of lines) {
      const [label, timestamp] = line.split(":");
      const time = Number(timestamp);
      const testType = label.slice(label.startsWith("START") ? 5 : 4).trim();
      if (label.startsWith("START")) startTimes[testType] = time;
      else if (label.startsWith("STOP")) {
        const difference = time - startTimes[testType];
        if (!results[testType])
          results[testType] = { total: 0, count: 0, times: [] };
        results[testType].total += difference;
        results[testType].count += 1;
        results[testType].times.push(difference);
      }
    }

    console.log(`Performance Test Result:\n------------------------`);
    for (let testType in results) {
      const { total, count, times } = results[testType];
      console.log(`\nTest Type: ${testType.replace(/_/g, " ")}`);
      times.forEach((time, index) =>
        console.log(`    ${index + 1}. ${time}ms`)
      );
      console.log(`    avg. ${(total / count).toFixed(2)}ms\n`);
    }

    console.log(`Summary:\n--------`);
    for (let testType in results) {
      const { total, count } = results[testType];
      console.log(`Test Type: ${testType.replace(/_/g, " ")} - avg. ${(total / count).toFixed(2)}ms`);
    }
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
  }
}

runScripts();
