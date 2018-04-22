/*
 * src/eth-service/model.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 28/12/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

export default function Model ({ store, schema }) {
  async function getBlock (req) {
    const validReq = await schema.validate('getBlockRequest', req)
    const block = await store.getBlockFromStorage(validReq)
    console.log('getBlockFromStorage', block)
    if (!block) {
      const block = await store.getBlockFromWeb3(validReq)
      console.log('getBlockFromWeb3', block)
      if (!block) {
        // throw new Error(`block ${validReq.number} does not exist`)
        return null
      }
      // Only store the blocks we want to
      try {
        const validBlock = await schema.validate('getBlockResponse', block)
        console.log('validBlock', validBlock)
        const output = store.postBlock(validBlock)
        return output
      } catch (error) {
        return null
      }
    }
    return schema.validate('getBlockResponse', block)
  }

  async function getTransaction (req) {
    const validReq = await schema.validate('getTransactionRequest', req)
    const transaction = await store.getTransactionFromStorage(validReq)
    if (!transaction) {
      const transaction = await store.getTransactionFromWeb3(validReq)
      if (!transaction) {
        // throw new Error(`transaction ${validReq.hash} does not exist`)
        return null
      }
      const validTransaction = schema.validate('getTransactionResponse', transaction)
      return store.postTransaction(validTransaction)
    }
    return schema.validate('getTransactionResponse', transaction)
  }

  async function getTransactionReceipt (req) {
    const validReq = await schema.validate('getTransactionReceiptRequest', req)
    const transactionReceipt = await store.getTransactionReceiptFromStorage(validReq)
    if (!transactionReceipt) {
      const transactionReceipt = await store.getTransactionReceiptFromWeb3(validReq)
      if (!transactionReceipt) {
        // throw new Error(`transaction ${validReq.hash} does not exist`)
        return null
      }
      const validTransactionReceipt = schema.validate('getTransactionReceiptResponse', transactionReceipt)
      return store.postTransactionReceipt(validTransactionReceipt)
    }
    return schema.validate('getTransactionReceiptResponse', transactionReceipt)
  }

  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}
