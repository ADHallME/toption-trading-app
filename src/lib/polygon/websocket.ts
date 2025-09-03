// Polygon WebSocket client for real-time options data
// This runs on the client side and connects to Polygon's WebSocket

class PolygonWebSocket {
  private ws: WebSocket | null = null
  private apiKey: string
  private reconnectTimeout: NodeJS.Timeout | null = null
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return
    
    // Polygon WebSocket URL for options
    this.ws = new WebSocket(`wss://socket.polygon.io/options`)
    
    this.ws.onopen = () => {
      console.log('Polygon WebSocket connected')
      // Authenticate
      this.send({
        action: 'auth',
        params: this.apiKey
      })
    }
    
    this.ws.onmessage = (event) => {
      const messages = JSON.parse(event.data)
      
      messages.forEach((msg: any) => {
        switch(msg.ev) {
          case 'status':
            if (msg.status === 'auth_success') {
              console.log('Polygon auth successful')
              // Subscribe to all watched symbols
              this.resubscribeAll()
            }
            break
            
          case 'Q': // Quote
            this.handleQuote(msg)
            break
            
          case 'T': // Trade
            this.handleTrade(msg)
            break
        }
      })
    }
    
    this.ws.onerror = (error) => {
      console.error('Polygon WebSocket error:', error)
    }
    
    this.ws.onclose = () => {
      console.log('Polygon WebSocket closed')
      this.scheduleReconnect()
    }
  }
  
  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }
  
  private handleQuote(data: any) {
    const symbol = data.sym
    const subscribers = this.subscribers.get(symbol)
    
    if (subscribers) {
      const quote = {
        symbol,
        bid: data.bp,
        ask: data.ap,
        bidSize: data.bs,
        askSize: data.as,
        timestamp: data.t
      }
      
      subscribers.forEach(callback => callback(quote))
    }
  }
  
  private handleTrade(data: any) {
    const symbol = data.sym
    const subscribers = this.subscribers.get(symbol)
    
    if (subscribers) {
      const trade = {
        symbol,
        price: data.p,
        size: data.s,
        timestamp: data.t
      }
      
      subscribers.forEach(callback => callback(trade))
    }
  }
  
  subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set())
      
      // Subscribe via WebSocket
      this.send({
        action: 'subscribe',
        params: `Q.${symbol},T.${symbol}`
      })
    }
    
    this.subscribers.get(symbol)?.add(callback)
  }
  
  unsubscribe(symbol: string, callback: (data: any) => void) {
    const subscribers = this.subscribers.get(symbol)
    if (subscribers) {
      subscribers.delete(callback)
      
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol)
        
        // Unsubscribe via WebSocket
        this.send({
          action: 'unsubscribe',
          params: `Q.${symbol},T.${symbol}`
        })
      }
    }
  }
  
  private resubscribeAll() {
    const symbols = Array.from(this.subscribers.keys())
    if (symbols.length > 0) {
      const params = symbols.flatMap(s => [`Q.${s}`, `T.${s}`]).join(',')
      this.send({
        action: 'subscribe',
        params
      })
    }
  }
  
  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    
    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect to Polygon...')
      this.connect()
    }, 5000)
  }
  
  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

let client: PolygonWebSocket | null = null

export function getPolygonWebSocket(apiKey: string): PolygonWebSocket {
  if (!client) {
    client = new PolygonWebSocket(apiKey)
    client.connect()
  }
  return client
}

export default PolygonWebSocket