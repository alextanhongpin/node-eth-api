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
  console.log(await setupDatabaseTables(db))

  // Setup schemas
  const schema = Schema()

  // Setup web3
  const web3 = new Web3(new Web3.providers.HttpProvider(config.get('web3Provider')))
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

  app.get('/status', async(req, res) => {
    res.status(200).json({
      isConnected: web3.isConnected(),
      syncing: web3.eth.syncing,
      blockNumber: web3.eth.blockNumber,
      pending: web3.eth.getBlock('pending')
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
    skip (req, res) {
      return res.statusCode < 400
    },
    stream: process.stderr
  }))

  app.use(morgan('dev', {
    skip (req, res) {
      return res.statusCode >= 400
    },
    stream: process.stdout
  }))
}

async function setupDatabaseTables (db) {
  const blockTable = db.query(`
    CREATE TABLE IF NOT EXISTS block (
      difficulty BIGINT,
      extraData VARCHAR(255),
      gasLimit INT,
      gasUsed INT,
      hash VARCHAR(255),
      logsBloom VARCHAR(255),
      miner VARCHAR(255),
      mixHash VARCHAR(255),
      nonce VARCHAR(255),
      number INT NOT NULL,
      parentHash VARCHAR(255),
      receiptsRoot VARCHAR(255),
      sha3Uncles VARCHAR(255),
      size INT,
      stateRoot VARCHAR(255),
      timestamp INT NOT NULL,
      totalDifficulty BIGINT,
      transactions JSON,
      transactionsRoot VARCHAR(255),
      uncles JSON,
      PRIMARY KEY (number)
    )
  `)

  const transactionTable = db.query(`
    CREATE TABLE IF NOT EXISTS transaction (
      hash VARCHAR(255),
      description VARCHAR(255),
      nonce INT,
      blockHash VARCHAR(255),
      blockNumber INT,
      transactionIndex INT,
      txFrom VARCHAR(255),
      txTo VARCHAR(255),
      value BIGINT,
      gasPrice BIGINT,
      gas INT,
      input VARCHAR(255),
      PRIMARY KEY (hash)
    )
  `)

  const transactionReceiptTable = db.query(`
    CREATE TABLE IF NOT EXISTS transactionReceipt (
      blockHash VARCHAR(255),
      blockNumber INT,
      transactionHash VARCHAR(255),
      transactionIndex INT,
      txFrom VARCHAR(255),
      txTo VARCHAR(255),
      cumulativeGasUsed INT,
      gasUsed INT,
      contractAddress VARCHAR(255),
      logs JSON,
      status VARCHAR(255),
      PRIMARY KEY (transactionHash)
    )
  `)
  return Promise.all([blockTable, transactionTable, transactionReceiptTable])
}

main().catch(console.log)
