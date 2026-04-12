const fs = require('fs');

async function testApi() {
  console.log("--- BẮT ĐẦU TEST PHÂN QUYỀN (RBAC) ---");
  const BASE_URL = 'http://localhost:3001/api/v1';

  async function login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  }

  console.log("1. Đang lấy token...");
  const buyer = await login('buyer@example.com', '123456');
  const supplier1 = await login('hanoielec@example.com', '123456');

  if (!buyer.token) {
    console.log("❌ Lỗi lấy token buyer:", buyer);
    return;
  }
  if(!supplier1.token) {
    console.log("❌ Lỗi lấy token supplier:", supplier1);
    return;
  }
  console.log("✅ Lấy token thành công");

  console.log("\n2. Test POST /products (Tạo sản phẩm mới)");
  
  // No token
  let res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Chôm chôm', categoryId: 'cat-123' })
  });
  console.log(`[Không Token] -> Phản hồi: ${res.status} (Kỳ vọng: 401) ${res.status === 401 ? '✅ PASS' : '❌ FAIL'}`);

  // Buyer token
  res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyer.token}`
    },
    body: JSON.stringify({ name: 'Chôm chôm', categoryId: 'cat-123' })
  });
  console.log(`[Token BUYER] -> Phản hồi: ${res.status} (Kỳ vọng: 403) ${res.status === 403 ? '✅ PASS' : '❌ FAIL'}`);

  // Supplier token
  res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supplier1.token}`
    },
    body: JSON.stringify({ 
      name: 'Chôm chôm siêu ngọt', 
      categoryId: 1, 
      minPrice: 10000, 
      maxPrice: 20000 
    })
  });
  // Should fail because categoryId is string vs integer vs not found, but if it is 400 that means it passed auth!
  const statusCode = res.status;
  if(statusCode !== 401 && statusCode !== 403) {
    console.log(`[Token SUPPLIER 1] -> Phản hồi: ${statusCode} (Passed Auth check) ✅ PASS`);
  } else {
    console.log(`[Token SUPPLIER 1] -> Phản hồi: ${statusCode} ❌ FAIL`);
  }

  console.log("\n3. Test Quét QR Công Khai (Public API)");
  const qrRes = await fetch(`${BASE_URL}/batches/qr/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'FAKE_QR_CODE', token: 'fake_token' })
  });
  
  const qrValid = qrRes.status !== 401 && qrRes.status !== 403;
  console.log(`[Public API Scan QR] -> Phản hồi: ${qrRes.status} (Kỳ vọng không bị chặn Auth) ${qrValid ? '✅ PASS' : '❌ FAIL'}`);

}

testApi();
