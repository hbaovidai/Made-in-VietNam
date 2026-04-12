const fs = require('fs');

async function testApi() {
  const BASE_URL = 'http://localhost:3001/api/v1';

  async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
  }

  console.log("1. Đang lấy token...");
  const buyer = await login('buyer@example.com', '123456');
  console.log(buyer);
}

testApi();
