// Render API Deployment Script
const https = require('https');
const http = require('http');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_API_BASE = 'api.render.com';

if (!RENDER_API_KEY) {
  console.log('❌ RENDER_API_KEY not found in environment');
  console.log('');
  console.log('To get your API key:');
  console.log('1. Go to: https://dashboard.render.com/account/api-keys');
  console.log('2. Create a new API key');
  console.log('3. Export it: export RENDER_API_KEY=your_key_here');
  console.log('');
  console.log('Then run: node render-api-deploy.js');
  process.exit(1);
}

// Render API helper
function renderAPI(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: RENDER_API_BASE,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message} - ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function deployBackend() {
  console.log('🚀 Starting Render API Deployment');
  console.log('================================');
  console.log('');

  try {
    // Step 1: Get owner ID (user or team)
    console.log('📋 Step 1: Getting account information...');
    const owner = await renderAPI('GET', '/v1/owners');
    console.log('✅ Account found');
    console.log('');

    // Step 2: Check if service already exists
    console.log('📋 Step 2: Checking for existing services...');
    const services = await renderAPI('GET', `/v1/services?ownerId=${owner.id}`);
    const existingService = services.find(s => s.name === 'florida-realtor-backend');
    
    if (existingService) {
      console.log('⚠️  Service already exists: ' + existingService.id);
      console.log('   Service URL: ' + existingService.serviceDetails?.url || 'Not yet deployed');
      console.log('');
      console.log('To update this service, please use Render dashboard');
      return;
    }

    console.log('✅ No existing service found');
    console.log('');

    // Note: Creating services via API requires repository connection
    // This is typically done through the dashboard first
    console.log('📝 Note: Service creation via API requires:');
    console.log('   - Repository already connected to Render');
    console.log('   - Service configuration');
    console.log('');
    console.log('For full automation, please:');
    console.log('1. Go to: https://dashboard.render.com');
    console.log('2. Connect GitHub: movshovich/florida-realtor-platform');
    console.log('3. Create Web Service manually (one-time)');
    console.log('4. Then I can automate environment variables and deployments');
    console.log('');
    console.log('OR use Render Blueprint:');
    console.log('1. Go to: https://dashboard.render.com');
    console.log('2. New → Blueprint');
    console.log('3. Connect: movshovich/florida-realtor-platform');
    console.log('4. Render will auto-detect and deploy!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('- Verify API key is correct');
    console.log('- Check API key permissions');
    console.log('- Ensure repository is connected to Render');
  }
}

// Run deployment
deployBackend();
