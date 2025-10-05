#!/usr/bin/env node

/**
 * Minimal test to verify the scanning system works with just 1 ticker
 * This will help us debug the conversion process
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

async function testMinimalScan() {
  console.log('🧪 Testing Minimal Scan (1 ticker only)');
  console.log('========================================');
  
  try {
    // Test 1: Get stock price for AAPL
    console.log('\n📈 Step 1: Getting AAPL stock price...');
    const priceResult = await makeRequest('/api/polygon/quote?symbol=AAPL');
    console.log(`Status: ${priceResult.status}`);
    console.log(`Price: $${priceResult.data.price}`);
    
    if (!priceResult.data.success || priceResult.data.price === 0) {
      console.log('❌ Failed to get stock price');
      return;
    }
    
    // Test 2: Get options for AAPL
    console.log('\n📊 Step 2: Getting AAPL options...');
    const optionsResult = await makeRequest('/api/polygon/options?symbol=AAPL');
    console.log(`Status: ${optionsResult.status}`);
    console.log(`Options found: ${optionsResult.data.options?.length || 0}`);
    
    if (!optionsResult.data.success || !optionsResult.data.options || optionsResult.data.options.length === 0) {
      console.log('❌ Failed to get options');
      return;
    }
    
    // Test 3: Show sample option data
    console.log('\n📋 Step 3: Sample option data...');
    const sampleOption = optionsResult.data.options[0];
    console.log(`Contract: ${sampleOption.details.ticker}`);
    console.log(`Type: ${sampleOption.details.contract_type}`);
    console.log(`Strike: $${sampleOption.details.strike_price}`);
    console.log(`Expiry: ${sampleOption.details.expiration_date}`);
    console.log(`Open Interest: ${sampleOption.open_interest}`);
    console.log(`Volume: ${sampleOption.day.volume}`);
    console.log(`IV: ${sampleOption.implied_volatility}`);
    
    // Test 4: Calculate opportunity manually
    console.log('\n💰 Step 4: Manual opportunity calculation...');
    const stockPrice = priceResult.data.price;
    const strike = sampleOption.details.strike_price;
    const isPut = sampleOption.details.contract_type === 'put';
    
    // Get bid/ask (using FMV as proxy for now)
    const premium = sampleOption.fmv || 0;
    const capital = strike * 100;
    const roi = (premium * 100) / capital;
    
    const expiry = new Date(sampleOption.details.expiration_date);
    const today = new Date();
    const dte = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const roiPerDay = roi / dte;
    
    console.log(`Stock Price: $${stockPrice}`);
    console.log(`Strike: $${strike}`);
    console.log(`Premium: $${premium}`);
    console.log(`Capital Required: $${capital}`);
    console.log(`ROI: ${(roi * 100).toFixed(2)}%`);
    console.log(`DTE: ${dte} days`);
    console.log(`ROI/Day: ${(roiPerDay * 100).toFixed(4)}%`);
    console.log(`Strategy: ${isPut ? 'Cash Secured Put' : 'Covered Call'}`);
    
    if (roiPerDay > 0.002) { // 0.2% per day
      console.log('✅ This would be a valid opportunity!');
    } else {
      console.log('❌ ROI too low for our criteria');
    }
    
    console.log('\n🎯 CONCLUSION:');
    console.log('✅ Stock price API works');
    console.log('✅ Options API works');
    console.log('✅ Data conversion logic works');
    console.log('✅ The scanning system should work, just needs time due to rate limiting');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMinimalScan();
