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
    const res = await store.getBlock(validReq)
    return schema.validate('getBlockResponse', res)
  }

  async function getTransaction (req) {
    const validReq = await schema.validate('getTransactionRequest', req)
    const res = await store.getTransaction(validReq)
    return schema.validate('getTransactionResponse', res)
  }

  async function getTransactionReceipt (req) {
    const validReq = await schema.validate('getTransactionReceiptRequest', req)
    const res = await store.getTransactionReceipt(validReq)
    return schema.validate('getTransactionReceiptResponse', res)
  }

  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}
