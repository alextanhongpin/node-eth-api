/*
 * test/eth-service/model.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 30/10/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/
/* eslint-env mocha */

import chai from 'chai'

import MockStore from './mock-store'
import Model from '../../src/eth-service/model'
import Schema from '../../src/schema'

// Schemas
import getBlockRequestSchema from '../../src/schema/get-block-request.json'
import getBlockResponseSchema from '../../src/schema/get-block-response.json'
import getTransactionRequestSchema from '../../src/schema/get-transaction-request.json'
import getTransactionResponseSchema from '../../src/schema/get-transaction-response.json'
import getTransactionReceiptRequestSchema from '../../src/schema/get-transaction-receipt-request.json'
import getTransactionReceiptResponseSchema from '../../src/schema/get-transaction-receipt-response.json'

const expect = chai.expect

const schema = Schema()

schema.add('getBlockRequest', getBlockRequestSchema)
schema.add('getBlockResponse', getBlockResponseSchema)
schema.add('getTransactionRequest', getTransactionRequestSchema)
schema.add('getTransactionResponse', getTransactionResponseSchema)
schema.add('getTransactionReceiptRequest', getTransactionReceiptRequestSchema)
schema.add('getTransactionReceiptResponse', getTransactionReceiptResponseSchema)

// In our test, we mock the store and only validate the model
// The route and store should not contain any business logic
const model = Model({
  store: MockStore(),
  schema
})

// Create a test suite to test the blocks
describe('Block Model', () => {
  it('should return response if block number/hash is valid', async () => {
    try {
      const blocks = await Promise.all([
        625106,
        689811
      ].map(number => model.getBlock({ number })))
      blocks.forEach((block) => {
        expect(block).to.be.not.eq(null)
        expect(block).to.be.an('object')
      })
    } catch (error) {
      expect(error).to.be.eq(null)
    }
  })

  it('should return null if block number/hash is invalid or does not exist', async() => {
    try {
      const block = await model.getBlock({
        number: 10000000
      })
      expect(block).to.be.eq(null)
    } catch (error) {
      expect(error).to.be.eq(null)
    }
  })

  it('should throw error if block number/hash is below 0', async() => {
    try {
      await model.getBlock({
        number: -1
      })
    } catch (error) {
      expect(error).to.be.an('array')
      expect(error[0].message).to.be.eq('should be >= 0')
    }
  })
})

describe('Transaction Model', () => {
  it('should return response if transaction hash is valid', async () => {
    try {
      const transactions = await Promise.all([
        '0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858',
        '0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad'
      ].map(hash => model.getTransaction({ hash })))

      transactions.forEach((transaction) => {
        expect(transaction).to.be.not.eq(null)
        expect(transaction).to.be.an('object')
      })
    } catch (error) {
      expect(error).to.be.eq(null)
    }
  })

  it('should return null if the transaction hash is invalid or does not exist', async() => {
    try {
      const transaction = await model.getTransaction({ hash: '0xf' })
      expect(transaction).to.be.equal(null)
    } catch (error) {
      expect(error).to.be.equal(null)
    }
  })
})

describe('Transaction Receipt Model', () => {
  it('should return response if transaction hash is valid', async () => {
    try {
      const transactions = await Promise.all([
        '0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858',
        '0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad'
      ].map(hash => model.getTransactionReceipt({ hash })))

      transactions.forEach((transaction) => {
        expect(transaction).to.be.not.eq(null)
        expect(transaction).to.be.an('object')
      })
    } catch (error) {
      expect(error).to.be.eq(null)
    }
  })

  it('should return null if the transaction hash is invalid or does not exist', async() => {
    try {
      const transaction = await model.getTransactionReceipt({ hash: '0xf' })
      expect(transaction).to.be.equal(null)
    } catch (error) {
      expect(error).to.be.equal(null)
    }
  })
})

describe('Schema', () => {
  it('should return error if schema does not exist', async () => {
    try {
      await schema.validate('nonExistingSchema', null)
    } catch (error) {
      expect(error).to.be.not.eq(null)
      expect(error.message).to.be.eq('schema nonExistingSchema does not exist')
    }
  })

  it('should return error if schema registration fail', async () => {
    try {
      schema.add()
    } catch (error) {
      expect(error).to.be.not.eq(null)
      expect(error.message).to.be.equal('schemaError: name and schema must be provided')
    }
  })
})
