const serviceFactory = require('./src/core/factories/ServiceFactory');

async function testUsers() {
  console.log('👥 Testing Users API...\n');

  try {
    // Test Database Connection
    console.log('1. Testing Database Connection...');
    const isConnected = await serviceFactory.testConnections();
    console.log(`   ${isConnected ? '✅' : '❌'} Database connection: ${isConnected ? 'SUCCESS' : 'FAILED'}\n`);

    if (!isConnected) {
      console.error('❌ Cannot test users without database connection');
      process.exit(1);
    }

    // Test User Service
    console.log('2. Testing User Service...');
    const userService = serviceFactory.getService('user');
    
    // Test getAll method
    const allUsersResult = await userService.getAll({}, { page: 1, limit: 10 });
    console.log(`   ${allUsersResult.success ? '✅' : '❌'} User Service getAll: ${allUsersResult.success ? 'SUCCESS' : allUsersResult.error}`);
    
    if (allUsersResult.success) {
      console.log(`   📊 Found ${allUsersResult.data.users.length} total users`);
      console.log('   📄 Users data structure:', JSON.stringify(allUsersResult.data, null, 2));
    }

    // Test getActiveUsers method
    const activeUsersResult = await userService.getActiveUsers({ page: 1, limit: 10 });
    console.log(`   ${activeUsersResult.success ? '✅' : '❌'} User Service getActiveUsers: ${activeUsersResult.success ? 'SUCCESS' : activeUsersResult.error}`);
    
    if (activeUsersResult.success) {
      console.log(`   📊 Found ${activeUsersResult.data.users.length} active users`);
      console.log('   📄 Active users data structure:', JSON.stringify(activeUsersResult.data, null, 2));
    }

    // Test User Controller
    console.log('\n3. Testing User Controller...');
    const userController = serviceFactory.getController('user');
    
    // Mock event for controller test
    const mockEvent = {
      queryStringParameters: null
    };
    
    const controllerResult = await userController.list(mockEvent);
    console.log(`   ${controllerResult.statusCode === 200 ? '✅' : '❌'} User Controller list: ${controllerResult.statusCode === 200 ? 'SUCCESS' : 'FAILED'}`);
    
    if (controllerResult.statusCode === 200) {
      const body = JSON.parse(controllerResult.body);
      console.log('   📄 Controller response structure:', JSON.stringify(body, null, 2));
    }

    console.log('\n🎉 USERS API TEST COMPLETED!');

  } catch (error) {
    console.error('❌ Users test failed:', error.message);
    console.error('📊 Error stack:', error.stack);
  }

  process.exit(0);
}

testUsers(); 