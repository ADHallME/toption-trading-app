#!/usr/bin/env node

/**
 * Test script to trigger a market scan and verify it works
 * This will help us debug the Polygon API integration
 */

const https = require('https');

const BASE_URL = 'https://www.toptiontrade.com';

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    console.log(`\n🌐 Making request to: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testScan() {
  console.log('🚀 Testing Toption Market Scan System');
  console.log('=====================================');
  
  try {
    // Step 1: Check if opportunities endpoint returns data
    console.log('\n📊 Step 1: Checking current opportunities...');
    const opportunitiesResult = await makeRequest('/api/opportunities-fast?marketType=equity');
    console.log(`Status: ${opportunitiesResult.status}`);
    console.log(`Success: ${opportunitiesResult.data.success}`);
    
    if (opportunitiesResult.data.success && opportunitiesResult.data.data.opportunities.length > 0) {
      console.log(`✅ Found ${opportunitiesResult.data.data.opportunities.length} cached opportunities!`);
      console.log(`Last scan: ${opportunitiesResult.data.data.metadata.lastScan}`);
      return;
    }
    
    console.log('❌ No cached opportunities found. Triggering scan...');
    
    // Step 2: Trigger a market scan
    console.log('\n🔄 Step 2: Triggering market scan...');
    const scanResult = await makeRequest('/api/market-scan?market=equity&batch=5');
    console.log(`Status: ${scanResult.status}`);
    console.log(`Success: ${scanResult.data.success}`);
    console.log(`Message: ${scanResult.data.message}`);
    
    if (!scanResult.data.success) {
      console.log('❌ Scan failed to start');
      return;
    }
    
    console.log('✅ Scan started successfully!');
    console.log('\n⏳ Waiting 30 seconds for scan to complete...');
    
    // Step 3: Wait and check again
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    console.log('\n📊 Step 3: Checking for results after 30 seconds...');
    const finalResult = await makeRequest('/api/opportunities-fast?marketType=equity');
    console.log(`Status: ${finalResult.status}`);
    console.log(`Success: ${finalResult.data.success}`);
    
    if (finalResult.data.success && finalResult.data.data.opportunities.length > 0) {
      console.log(`✅ SUCCESS! Found ${finalResult.data.data.opportunities.length} opportunities!`);
      console.log(`Last scan: ${finalResult.data.data.metadata.lastScan}`);
      console.log(`Tickers scanned: ${finalResult.data.data.metadata.tickersScanned}`);
      console.log(`Scan duration: ${(finalResult.data.data.metadata.scanDurationMs / 1000).toFixed(1)}s`);
    } else {
      console.log('❌ Still no opportunities found. Check Vercel logs for errors.');
      console.log('Response:', JSON.stringify(finalResult.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testScan();
