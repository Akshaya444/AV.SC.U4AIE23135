const Log = require("./logger");

async function runTests() {
    try {
        console.log("\n--- Test 1: Frontend Component Log ---");
        await Log(
            "frontend",
            "info",
            "component",
            "Navbar rendered successfully"
        );

        console.log("\n--- Test 2: Frontend Hook Log ---");
        await Log(
            "frontend",
            "debug",
            "hook",
            "useAuth hook initialized"
        );

        console.log("\n--- Test 3: Frontend Page Log ---");
        await Log(
            "frontend",
            "warn",
            "page",
            "Dashboard page loading slowly"
        );

    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTests();
