const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('  RECIPEHUB FULL-STACK AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Health check
  console.log('--- Test Suite 1: System Health ---');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.status === 'healthy', 'API health check /api/health');
  } catch (err) {
    assert(false, `API health check failed: ${err.message}`);
  }

  // 2. Authentication: User Registration
  console.log('\n--- Test Suite 2: User Authentication & Security ---');
  const uniqueEmail = `intern.chef.${Date.now()}@example.com`;
  let userToken = '';
  let userId = '';

  try {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Intern Test Chef',
        email: uniqueEmail,
        password: 'securepassword123'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token && regData.user.email === uniqueEmail, 'User registration succeeds with 201 Created & JWT');
    userToken = regData.token;
    userId = regData.user.id;

    // Test duplicate email registration rejection
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Chef',
        email: uniqueEmail,
        password: 'securepassword123'
      })
    });
    assert(dupRes.status === 400, 'Duplicate email registration correctly rejected with 400 Bad Request');
  } catch (err) {
    assert(false, `Registration tests failed: ${err.message}`);
  }

  // 3. Authentication: User Login & Validation
  try {
    // Valid login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'securepassword123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, 'Login with valid credentials succeeds with 200 OK');

    // Invalid login
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'wrongpassword'
      })
    });
    assert(badLoginRes.status === 401, 'Login with incorrect password rejected with 401 Unauthorized');

    // Protected /me endpoint with token
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === uniqueEmail, 'Protected GET /api/auth/me returns authenticated user details');

    // Protected /me endpoint without token
    const unauthRes = await fetch(`${BASE_URL}/auth/me`);
    assert(unauthRes.status === 401, 'Unauthenticated request to GET /api/auth/me correctly blocked with 401');
  } catch (err) {
    assert(false, `Login tests failed: ${err.message}`);
  }

  // 4. Recipe CRUD Operations & Image Upload
  console.log('\n--- Test Suite 3: Recipe CRUD & Multer Uploads ---');
  let createdRecipeId = '';

  try {
    // Create a temporary dummy image file to test real Multer file upload
    const dummyImagePath = path.join(__dirname, 'test-food-upload.jpg');
    fs.writeFileSync(dummyImagePath, Buffer.from('fake-image-bytes-jpeg-content'));

    const formData = new FormData();
    formData.append('title', 'Truffle Mushroom Risotto');
    formData.append('description', 'Creamy Arborio rice with wild forest mushrooms and aged Parmigiano-Reggiano.');
    formData.append('category', 'Italian');
    formData.append('prepTime', '15');
    formData.append('cookTime', '25');
    formData.append('servings', '2');
    formData.append('ingredients', JSON.stringify(['1 cup Arborio rice', '200g wild mushrooms', '3 cups vegetable stock', '1/2 cup Parmesan cheese']));
    formData.append('steps', JSON.stringify(['Sauté sliced mushrooms in olive oil until golden.', 'Add rice and toast lightly for 2 minutes.', 'Ladle hot broth gradually while stirring until creamy and al dente.']));

    const fileBlob = new Blob([fs.readFileSync(dummyImagePath)], { type: 'image/jpeg' });
    formData.append('image', fileBlob, 'truffle_risotto.jpg');

    const createRes = await fetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: formData
    });
    const createData = await createRes.json();

    assert(createRes.status === 201 && createData.data && createData.data.title === 'Truffle Mushroom Risotto', 'Recipe created with Multer image upload (POST /api/recipes)');
    createdRecipeId = createData.data._id;
    assert(createData.data.image && createData.data.image.includes('/uploads/recipe-'), 'Uploaded image saved to /uploads/ with unique hashed filename');

    // Clean up temporary dummy file
    if (fs.existsSync(dummyImagePath)) fs.unlinkSync(dummyImagePath);
  } catch (err) {
    assert(false, `Recipe creation test failed: ${err.message}`);
  }

  // 5. Querying Recipes: List, Details, Search, Filter
  console.log('\n--- Test Suite 4: Querying, Search & Filtering ---');
  try {
    // View all recipes
    const listRes = await fetch(`${BASE_URL}/recipes`);
    const listData = await listRes.json();
    assert(listRes.status === 200 && Array.isArray(listData.data) && listData.total >= 9, 'GET /api/recipes returns paginated list of recipes');

    // View single recipe details
    const getOneRes = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`);
    const getOneData = await getOneRes.json();
    assert(getOneRes.status === 200 && getOneData.data.title === 'Truffle Mushroom Risotto' && getOneData.data.author.name === 'Intern Test Chef', 'GET /api/recipes/:id returns recipe with populated author');

    // Search by name
    const searchRes = await fetch(`${BASE_URL}/recipes/search?name=Truffle`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && searchData.data.some(r => r.title.includes('Truffle')), 'GET /api/recipes/search?name= searches recipes by keyword');

    // Filter by category
    const filterRes = await fetch(`${BASE_URL}/recipes/filter?category=Italian`);
    const filterData = await filterRes.json();
    assert(filterRes.status === 200 && filterData.data.every(r => r.category === 'Italian'), 'GET /api/recipes/filter?category= returns only Italian recipes');

    // Get My Recipes
    const myRecipesRes = await fetch(`${BASE_URL}/recipes/my-recipes`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const myRecipesData = await myRecipesRes.json();
    assert(myRecipesRes.status === 200 && myRecipesData.data.some(r => r._id === createdRecipeId), 'GET /api/recipes/my-recipes returns recipes created by logged-in user');
  } catch (err) {
    assert(false, `Querying and search tests failed: ${err.message}`);
  }

  // 6. Authorization & Recipe Updates / Deletions
  console.log('\n--- Test Suite 5: Authorization & Recipe Management ---');
  try {
    // Login as a second user to test unauthorized attempts
    const chef2Login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'marco@recipehub.com',
        password: 'password123'
      })
    });
    const chef2Data = await chef2Login.json();
    const chef2Token = chef2Data.token;

    // Unauthorized edit attempt
    const badEditRes = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${chef2Token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: 'Hacked Risotto' })
    });
    assert(badEditRes.status === 403, 'Unauthorized edit attempt by non-author correctly blocked with 403 Forbidden');

    // Unauthorized delete attempt
    const badDelRes = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${chef2Token}` }
    });
    assert(badDelRes.status === 403, 'Unauthorized delete attempt by non-author correctly blocked with 403 Forbidden');

    // Authorized edit by owner
    const goodEditRes = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Artisanal White Truffle Mushroom Risotto',
        cookTime: 28
      })
    });
    const goodEditData = await goodEditRes.json();
    assert(goodEditRes.status === 200 && goodEditData.data.title === 'Artisanal White Truffle Mushroom Risotto' && goodEditData.data.cookTime === 28, 'Authorized recipe update by owner succeeds (PUT /api/recipes/:id)');

    // Authorized delete by owner
    const goodDelRes = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(goodDelRes.status === 200, 'Authorized recipe deletion by owner succeeds (DELETE /api/recipes/:id)');

    // Verify deleted recipe returns 404
    const checkDeleted = await fetch(`${BASE_URL}/recipes/${createdRecipeId}`);
    assert(checkDeleted.status === 404, 'Subsequent lookup of deleted recipe returns 404 Not Found');
  } catch (err) {
    assert(false, `Authorization tests failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The application is fully functional.');
    process.exit(0);
  } else {
    console.error('❌ Some tests failed. Please review the output above.');
    process.exit(1);
  }
}

runTests();
