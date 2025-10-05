#!/usr/bin/env node

/**
 * Test script to verify basic Polygon API functionality
 * Tests a single ticker to see if the API calls work
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

async function testSingleTicker() {
  console.log('🧪 Testing Single Ticker Polygon API Integration');
  console.log('===============================================');
  
  try {
    // Test 1: Get stock price for AAPL
    console.log('\n📈 Test 1: Getting stock price for AAPL...');
    const priceResult = await makeRequest('/api/polygon/quote?symbol=AAPL');
    console.log(`Status: ${priceResult.status}`);
    console.log(`Response:`, JSON.stringify(priceResult.data, null, 2));
    
    if (priceResult.data.success && priceResult.data.price > 0) {
      console.log(`✅ SUCCESS! AAPL price: $${priceResult.data.price}`);
    } else {
      console.log('❌ Failed to get AAPL price');
    }
    
    // Test 2: Get options chain for AAPL
    console.log('\n📊 Test 2: Getting options chain for AAPL...');
    const optionsResult = await makeRequest('/api/polygon/options?symbol=AAPL');
    console.log(`Status: ${optionsResult.status}`);
    console.log(`Response:`, JSON.stringify(optionsResult.data, null, 2));
    
    if (optionsResult.data.success && optionsResult.data.options && optionsResult.data.options.length > 0) {
      console.log(`✅ SUCCESS! Found ${optionsResult.data.options.length} options for AAPL`);
    } else {
      console.log('❌ Failed to get AAPL options');
    }
    
    // Test 3: Check if we can get ticker list
    console.log('\n📋 Test 3: Testing ticker list...');
    const tickersResult = await makeRequest('/api/tickers?marketType=equity');
    console.log(`Status: ${tickersResult.status}`);
    console.log(`Response:`, JSON.stringify(tickersResult.data, null, 2));
    
    if (tickersResult.data.success && tickersResult.data.tickers && tickersResult.data.tickers.length > 0) {
      console.log(`✅ SUCCESS! Found ${tickersResult.data.tickers.length} tickers`);
    } else {
      console.log('❌ Failed to get ticker list');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSingleTicker();
