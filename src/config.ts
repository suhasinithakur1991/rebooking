import path from 'path';

function getEnvUrl(url: string, port?: string): string {
  return (url === 'http://localhost') ? `${url}:${port}` : url;
}

class Config {
    API_INTERVAL: number = 60

    // AWS
    AWS_REGION: string = 'ap-south-1'

    // SESSION
    SESSION_KEY: string = process.env.SESSION_KEY || 'udchalotest'
    LOGGER_AUTH_DELIVERY_STREAM: string = 'sls-logs'
    LOGGER_MAX_DELAY_TIME: number = (1000 * 60)/2 // One Minute
    LOGGER_MAX_QUEUE: number = 100

    // REDIS
    REDIS_HOST: string = process.env.REDIS_HOST || 'localhost'
    REDIS_PORT: number = 6379
    REDIS_ENABLE_OFFLINE_QUEUE: boolean = true
    REDIS_PASSWORD = null

    SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY || ''

    // SERVER_URLS
    FLIGHTS_URL: string = `${getEnvUrl(process.env.FLIGHT_URL || 'http://localhost', process.env.FLIGHT_PORT || '3200')}`
    USER_URL: string = `${getEnvUrl(process.env.USER_URL || 'http://localhost', process.env.USER_PORT || '3300')}`
    HOTELS_URL: string = `https://hotels-${process.env.NODE_ENV}-api.udchalo.com`
    BUSES_SERVER_URL: string = `https://bus-engine-${process.env.NODE_ENV}-api.udchalo.com`
    UDCHALO_HOME_URL: string = `${getEnvUrl(process.env.WEBSITE_URL || 'http://localhost', process.env.WEBSITE_PORT || '4200')}`
    WALLET_URL: string = `${getEnvUrl(process.env.WALLET_URL || 'http://localhost', process.env.WALLET_PORT || '4300')}`
    SUPPORT_URL: string = `${getEnvUrl(process.env.SUPPORT_URL || 'http://localhost', process.env.SUPPORT_PORT || '3100')}`
    LOGGER_URL: string = `${getEnvUrl(process.env.LOGGER_URL || 'http://localhost', process.env.LOGGER_PORT || '3500')}`

    // CORS
    CORS_EXPOSE_HEADERS: Array<string> = ['WWW-Authenticate', 'Server-Authorization']
    CORS_ALLOWED_ORIGINS: Array<string> = [
      'http://localhost:4100',
      'http://localhost:4200',
      `${getEnvUrl(process.env.HOTEL_URL || 'http://localhost', process.env.HOTELS_PORT || '3000')}`,
      `${getEnvUrl(process.env.BUS_URL || 'http://localhost', process.env.BUS_PORT || '3000')}`,
      `${getEnvUrl(process.env.WEBSITE_URL || 'http://localhost', process.env.WEBSITE_PORT || '3000')}`,
      `${getEnvUrl(process.env.CAB_URL || 'http://localhost', process.env.CAB_PORT || '3000')}`
    ]
    CORS_MAX_AGE: number = 5
    CORS_CREDENTIALS: boolean = true
    CORS_ALLOWED_HEADERS: Array<string> = ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept', 'userSessionId', 'source', 'platform', 'x-frame-options']
    CORS_ALLOWED_METHODS: Array<string> = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS']

    TEMPLATE = {
      SEARCH: '/src/templates/search.ejs' 
    }
    // FLIGHTBOOKING PROJECTIONS
    FLIGHT_BOOKING_USERID_PROJECTION: Array<string> = ['pnr', 'contactDetails', 'status', 'departDate', 'arriveDate', 'fare', 'dateOfBooking', 'bookingId', 'origin', 'destination', 'airlin']

    // VALIDATIONS
    VALID_SOURCES: Array<string> = ['app', 'website']
    VALID_GENDERS: Array<string> = ['male', 'female']
    VALID_PASSENGER_TYPES: Array<string> = ['adult', 'child', 'infant']
    PRODUCTS: Array<string> = ['flights', 'hotels', 'buses', 'cabs']
    STATUS: Array<string> = ['booked', 'cancelled', 'pending', 'hold']

    API_REQUEST = {
      POST: 'POST',
      GET: 'GET',
      PUT: 'PUT',
      DELETE: 'DELETE',
      FORM_POST: 'FORM_POST'
    }

    VALID_STATE = {
      D0 : 'D0',
      D1 : 'D1',
      D3 : 'D3',
      D5 : 'D5'
    }
  
    EMAILS = {
      NOTIFICATIONS : 'Notifications@udchalo.com',
      NOTIFICATION_TAG: 'udChalo Notifications'
    }

    VALID_EVENT_TYPES: Array<string> = ['search', 'payment', 'price', 'booking']
    IS_ENABLED: Array<number> = [0,1] 

    ROLES: any = {
      AGENT: 'agent',
      ADMIN: 'admin',
      VERIFY_AGENT: 'verifyAgent',
      REFUND_AGENT: 'refundAgent',
      DEFAULT: 'default',
      EXECUTIVE: 'executive',
      ACCOUNTS: 'accounts',
      LEAD: 'lead',
      BDM: 'bdm',
    }

    BookingType: any = {
      FLIGHTS: 'flights',
      BUSES: 'buses',
      HOTELS: 'hotels',
    }

  BookingStatus: any = {
    Booked: 'booked',
    Cancelled: 'cancelled',
    Pending: 'pending',
    Hold: 'hold',
  }
}

export default new Config();
