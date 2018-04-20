/*
 * src/index.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 17/10/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'
import Web3 from 'web3'

// Internal dependencies
import config from './config'
import DB from './database'
import Schema from './schema'
import EthService from './eth-service'

// Schemas
import getBlockRequestSchema from './schema/get-block-request.json'
import getBlockResponseSchema from './schema/get-block-response.json'
import getTransactionRequestSchema from './schema/get-transaction-request.json'
import getTransactionResponseSchema from './schema/get-transaction-response.json'
import getTransactionReceiptRequestSchema from './schema/get-transaction-receipt-request.json'
import getTransactionReceiptResponseSchema from './schema/get-transaction-receipt-response.json'

// main is where our application resides
async function main () {
  // Create a new application
  const app = express()
  
  // Setup middlewares
  middlewares(app)

  // Setup database
  const db = await DB.connect(config.get('db'))

  // Setup schemas
  const schema = Schema()

  // Setup web3
  const web3 = new Web3(new web3.providers.HttpProvider(config.get('web3Provider')))
  if (web3.isConnected()) {
    console.log(`connected to web3 successfully`)
  }

  schema.add('getBlockRequest', getBlockRequestSchema)
  schema.add('getBlockResponse', getBlockResponseSchema)
  schema.add('getTransactionRequest', getTransactionRequestSchema)
  schema.add('getTransactionResponse', getTransactionResponseSchema)
  schema.add('getTransactionReceiptRequest', getTransactionReceiptRequestSchema)
  schema.add('getTransactionReceiptResponse', getTransactionReceiptResponseSchema)

  const services = [ EthService ].map(service => service({ db, schema, web3 }))

  // Initialize service by looping through them
  services.forEach((service) => {
    app.use(service.basePath, service.route)
  })

  app.get('/', async (req, res) => {
    res.status(200).json({
      endpoints: services.map((service) => service.info),
      routes: app.routes
    })
  })

  // Host the schemas as static file
  app.use('/schemas', express.static(path.join(__dirname, 'schema')))

  app.listen(config.get('port'), () => {
    console.log(`listening to port *:${config.get('port')}. press ctrl + c to cancel`)
  })

  return app
}

function middlewares (app) {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(helmet())

  app.use(morgan('dev', {
    skip(req, res) {
      return res.statusCode < 400
    },
    stream: process.stderr
  }))

  app.use(morgan('dev', {
    skip(req, res) {
      return res.statusCode >= 400
    },
    stream: process.stdout
  }))
}

main().catch(console.log)
