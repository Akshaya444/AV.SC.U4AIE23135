const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhcHV0dGk3QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2MDgyNywiaWF0IjoxNzc4MDU5OTI3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjU5NmNlMTctNGEyNS00NDM0LTk1ZWItZTAwMTcyMzQxODFhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicC5ha3NoYXlhIiwic3ViIjoiMzk1NzBlNjEtODBiNi00NzU0LTljMTQtZWUwY2ZmNDFkMTE3In0sImVtYWlsIjoiYWtzaGF5YXB1dHRpN0BnbWFpbC5jb20iLCJuYW1lIjoicC5ha3NoYXlhIiwicm9sbE5vIjoiYXYuc2MudTRhaWUyMzEzNSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjM5NTcwZTYxLTgwYjYtNDc1NC05YzE0LWVlMGNmZjQxZDExNyIsImNsaWVudFNlY3JldCI6InZhVXFtdktnVWZRalF5aEEifQ.0EBjUFpJJ6lrnEA49pffBY7QRy0Nzb7Uxs1aDd2C3r0";

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
