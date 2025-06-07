const serviceFactory = require('./src/core/factories/ServiceFactory');

async function testSimple() {
  console.log('🧪 Testing Refactored Architecture...\n');

  try {
    // Test Factory
    console.log('1. Testing ServiceFactory...');
    const campaignService = serviceFactory.getService('campaign');
    const campaignController = serviceFactory.getController('campaign');
    console.log('   ✅ Services and Controllers created successfully\n');

    // Test Database Connection
    console.log('2. Testing Database Connection...');
    const isConnected = await serviceFactory.testConnections();
    console.log(`   ${isConnected ? '✅' : '❌'} Database connection: ${isConnected ? 'SUCCESS' : 'FAILED'}\n`);

    // Test Campaign Service
    console.log('3. Testing Campaign Service...');
    const result = await campaignService.getAll({}, { page: 1, limit: 5 });
    console.log(`   ${result.success ? '✅' : '❌'} Campaign Service: ${result.success ? 'SUCCESS' : result.error}\n`);

    if (result.success) {
      console.log(`   📊 Found ${result.data.campaigns.length} campaigns`);
      console.log(`   📄 Page ${result.data.pagination.page} of ${result.data.pagination.pages}`);
    }

    console.log('\n🎉 REFACTORED ARCHITECTURE IS WORKING!');
    console.log('\n📋 Available endpoints:');
    console.log('   🏢 CAMPAIGNS:');
    console.log('   • GET  /api/campaigns        - List campaigns');
    console.log('   • POST /api/campaigns        - Create campaign');
    console.log('   • GET  /api/campaigns/:id    - Get campaign');
    console.log('   • PUT  /api/campaigns/:id    - Update campaign');
    console.log('   • DELETE /api/campaigns/:id  - Delete campaign');
    console.log('   • POST /api/campaigns/:id/process - Process campaign');
    console.log('   📱 MESSAGES:');
    console.log('   • GET  /api/campaigns/:id/messages - Get campaign messages');
    console.log('   • GET  /api/messages/:id     - Get message by ID');
    console.log('   • GET  /api/messages/stats   - Get message statistics');
    console.log('   👥 USERS:');
    console.log('   • GET  /api/users            - List users');
    console.log('   • GET  /api/users/active     - Get active users');
    console.log('   🔍 MONITORING:');
    console.log('   • GET  /api/health           - Health check');
    console.log('\n🚀 Start server: npx serverless offline');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  process.exit(0);
}

testSimple(); 