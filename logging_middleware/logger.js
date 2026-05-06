const axios = require("axios");

// Token is refreshed on each session via /evaluation-service/auth
// clientID: 39570e61-80b6-4754-9c14-ee0cff41d117
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhcHV0dGk3QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2ODIxMSwiaWF0IjoxNzc4MDY3MzExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTVhMzgyYzItNmYxNi00M2JiLWE2MTctYjZhNmMwNjJmYzllIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicC5ha3NoYXlhIiwic3ViIjoiMzk1NzBlNjEtODBiNi00NzU0LTljMTQtZWUwY2ZmNDFkMTE3In0sImVtYWlsIjoiYWtzaGF5YXB1dHRpN0BnbWFpbC5jb20iLCJuYW1lIjoicC5ha3NoYXlhIiwicm9sbE5vIjoiYXYuc2MudTRhaWUyMzEzNSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjM5NTcwZTYxLTgwYjYtNDc1NC05YzE0LWVlMGNmZjQxZDExNyIsImNsaWVudFNlY3JldCI6InZhVXFtdktnVWZRalF5aEEifQ.5fe37hJdGVqetfHdddOjBzUYgt1vuDZAOY9jTILOh74";

async function Log(stack, level, pkg, message) {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("SUCCESS:", response.data);
        return response.data;

    } catch (error) {
        console.log("ERROR");

        if (error.response) {
            console.log(error.response.data);
            throw error.response.data;
        } else {
            console.log(error.message);
            throw error;
        }
    }
}

module.exports = Log;
