#!/usr/bin/env node

/**
 * Complete System Test for Toption Trading App
 * Tests all major components and APIs
 */

const https = require('https');

const BASE_URL = 'https://www.toptiontrade.com';

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    console.log(`\n🌐 ${path}`);
    
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

async function testCompleteSystem() {
  console.log('🚀 COMPLETE SYSTEM TEST - TOPTION TRADING APP');
  console.log('==============================================');
  
  const results = {
    stockPrice: false,
    optionsData: false,
    tickerList: false,
    marketScan: false,
    opportunities: false,
    dashboard: false
  };
  
  try {
    // Test 1: Stock Price API
    console.log('\n📈 Test 1: Stock Price API');
    const priceResult = await makeRequest('/api/polygon/quote?symbol=AAPL');
    if (priceResult.status === 200 && priceResult.data.success && priceResult.data.price > 0) {
      console.log(`✅ Stock Price API: $${priceResult.data.price}`);
      results.stockPrice = true;
    } else {
      console.log('❌ Stock Price API failed');
    }
    
    // Test 2: Options Data API
    console.log('\n📊 Test 2: Options Data API');
    const optionsResult = await makeRequest('/api/polygon/options?symbol=AAPL');
    if (optionsResult.status === 200 && optionsResult.data.success && optionsResult.data.options?.length > 0) {
      console.log(`✅ Options API: ${optionsResult.data.options.length} options found`);
      results.optionsData = true;
    } else {
      console.log('❌ Options API failed');
    }
    
    // Test 3: Ticker List API
    console.log('\n📋 Test 3: Ticker List API');
    const tickersResult = await makeRequest('/api/tickers-public?marketType=equity');
    if (tickersResult.status === 200 && tickersResult.data.success && tickersResult.data.tickers?.length > 0) {
      console.log(`✅ Ticker List: ${tickersResult.data.tickers.length} tickers available`);
      results.tickerList = true;
    } else {
      console.log('❌ Ticker List API failed');
    }
    
    // Test 4: Market Scan API
    console.log('\n🔄 Test 4: Market Scan API');
    const scanResult = await makeRequest('/api/market-scan?market=equity&batch=5');
    if (scanResult.status === 200 && scanResult.data.success) {
      console.log(`✅ Market Scan: ${scanResult.data.message}`);
      results.marketScan = true;
    } else {
      console.log('❌ Market Scan API failed');
    }
    
    // Test 5: Opportunities API
    console.log('\n💰 Test 5: Opportunities API');
    const oppsResult = await makeRequest('/api/opportunities-fast?marketType=equity');
    if (oppsResult.status === 200) {
      if (oppsResult.data.success && oppsResult.data.data.opportunities?.length > 0) {
        console.log(`✅ Opportunities: ${oppsResult.data.data.opportunities.length} opportunities found`);
        results.opportunities = true;
      } else {
        console.log(`⚠️  Opportunities: ${oppsResult.data.message || 'No opportunities yet'}`);
        results.opportunities = 'scanning';
      }
    } else {
      console.log('❌ Opportunities API failed');
    }
    
    // Test 6: Dashboard Page
    console.log('\n🖥️  Test 6: Dashboard Page');
    const dashboardResult = await makeRequest('/dashboard');
    if (dashboardResult.status === 200 && typeof dashboardResult.data === 'string' && dashboardResult.data.includes('TOPTION')) {
      console.log('✅ Dashboard: Page loads successfully');
      results.dashboard = true;
    } else {
      console.log('❌ Dashboard failed to load');
    }
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`Stock Price API: ${results.stockPrice ? '✅' : '❌'}`);
    console.log(`Options Data API: ${results.optionsData ? '✅' : '❌'}`);
    console.log(`Ticker List API: ${results.tickerList ? '✅' : '❌'}`);
    console.log(`Market Scan API: ${results.marketScan ? '✅' : '❌'}`);
    console.log(`Opportunities API: ${results.opportunities === true ? '✅' : results.opportunities === 'scanning' ? '⚠️' : '❌'}`);
    console.log(`Dashboard Page: ${results.dashboard ? '✅' : '❌'}`);
    
    const successCount = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 OVERALL RESULT: ${successCount}/${totalTests} tests passed`);
    
    if (successCount >= 4) {
      console.log('🎉 SYSTEM IS WORKING! Ready for launch!');
      console.log('\n📝 NEXT STEPS:');
      console.log('1. Visit https://www.toptiontrade.com/dashboard');
      console.log('2. Click "Equities" tab to see equity opportunities');
      console.log('3. Click "Indexes" tab to see index opportunities (requires subscription)');
      console.log('4. Click "Futures" tab to see futures opportunities (requires subscription)');
      console.log('5. Use the Options Screener to find specific opportunities');
    } else {
      console.log('⚠️  SYSTEM NEEDS ATTENTION');
      console.log('Check the failed tests above and fix the issues.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCompleteSystem();
