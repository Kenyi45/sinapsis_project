const cors = require('cors');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

const response = {
  success: (data, statusCode = 200) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  }),

  error: (message, statusCode = 500, errors = null) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    })
  }),

  validation: (errors, statusCode = 400) => ({
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      message: 'Validation failed',
      errors,
      timestamp: new Date().toISOString()
    })
  }),

  notFound: (resource = 'Resource') => ({
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      message: `${resource} not found`,
      timestamp: new Date().toISOString()
    })
  })
};

module.exports = response; 