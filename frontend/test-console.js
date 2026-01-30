// Test script to run in browser console
async function testSignup() {
    try {
        console.log('Testing signup...');
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Console Test User',
                email: 'console-test@example.com',
                password: 'password123',
                phone: '5555555555'
            })
        });
        
        const data = await response.json();
        console.log('Signup response:', data);
        return data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

async function testLogin() {
    try {
        console.log('Testing login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'console-test@example.com',
                password: 'password123'
            })
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Run tests
console.log('Starting API tests...');
testSignup().then(() => {
    return testLogin();
}).then(() => {
    console.log('All tests completed!');
}).catch((error) => {
    console.error('Test failed:', error);
}); 