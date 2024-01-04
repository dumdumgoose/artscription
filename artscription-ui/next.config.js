/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
    env: {
        REST_HOST: process.env.REST_HOST || 'localhost',
        REST_PORT: process.env.REST_PORT || '3000',
    }
}

module.exports = nextConfig
