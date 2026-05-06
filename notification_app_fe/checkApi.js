const axios = require('axios');

(async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhcHV0dGk3QGdtYWlsLmNvbSIsImV4cCI6MTc3ODA2MTM3MywiaWF0IjoxNzc4MDYwNDczLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNTMzMjAwM2ItMjY4MC00YjdiLWI5NmUtY2VjMjYzOTVkZWMyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicC5ha3NoYXlhIiwic3ViIjoiMzk1NzBlNjEtODBiNi00NzU0LTljMTQtZWUwY2ZmNDFkMTE3In0sImVtYWlsIjoiYWtzaGF5YXB1dHRpN0BnbWFpbC5jb20iLCJuYW1lIjoicC5ha3NoYXlhIiwicm9sbE5vIjoiYXYuc2MudTRhaWUyMzEzNSIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjM5NTcwZTYxLTgwYjYtNDc1NC05YzE0LWVlMGNmZjQxZDExNyIsImNsaWVudFNlY3JldCI6InZhVXFtdktnVWZRalF5aEEifQ.u1eS7xJRCCYYzEukADbIAgLuSt32LTDni8UMawtQMu0";
  try {
    const response = await axios.get('http://20.207.122.201/evaluation-service/notifications', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        limit: 10,
        page: 1
      }
    });
    console.log('status', response.status);
    console.log('notifications count', Array.isArray(response.data.notifications) ? response.data.notifications.length : JSON.stringify(response.data));
  } catch (error) {
    if (error.response) {
      console.error('response', error.response.status, error.response.data);
    } else {
      console.error('error', error.message);
    }
  }
})();
