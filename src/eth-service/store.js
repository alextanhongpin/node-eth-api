/*
 * src/eth-service/store.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 28/12/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

export default function Store (db) {

  // NOTE: In large scale projects, it might be more sensible to separate the read/write at the 
  // code level, as well as the database user

  // Reads

  async function getBlockFromWeb3 ({ number }) {
    return web3.eth.getBlock(number)
  }
 
  async function getTransaction ({ hash }) {
    return web3.eth.getTransaction(hash)
  }
 
  async function getTransactionReceipt ({ hash }) {
    return web3.eth.getTransactionReceipt(hash)
  }

  async function getBlockFromStorage ({ number }) {
    const [rows] = await db.query('SELECT * FROM block WHERE blockNumber = ?', [number])
    return (rows && rows[0]) || null
  }

  async function getTransactionFromStorage ({ hash }) {
    const [rows] = await db.query('SELECT * FROM transaction WHERE transactionHash = ?', [hash])
    return (rows && rows[0]) || null
  }

  async function getTransactionReceiptFromStorage ({ hash }) {
    const [rows] = await db.query('SELECT * FROM transactionReceipt WHERE transactionHash = ?', [hash])
    return (rows && rows[0]) || null
  }

  // Writes

  async function postBlock (block) {
    const [ rows ] = await db.query('INSERT INTO block (a, b) VALUES (?, ?)', ['1', '2'])
    return rows
  }

  async function postTransaction (block) {
    const [ rows ] = await db.query('INSERT INTO transaction (a, b) VALUES (?, ?)', ['1', '2'])
    return rows
  }

  async function postTransactionReceipt (block) {
    const [ rows ] = await db.query('INSERT INTO transactionReceipt (a, b) VALUES (?, ?)', ['1', '2'])
    return rows
  } 

  // Facade operation

  async function getBlock ({ number }) {
    // Query db/cache to check if block exists
    const block = await getBlockFromStorage({ number })

    // Block is not available in current storage, query from main net
    if (!block) {
      const block = await getBlockFromWeb3({ number })

      // Block still does not exist, throw error
      if (!block) {
        throw new Error(`block ${number} does not exist`)
      }

      // Store new block in the database
      const newBlockWithId = await postBlock(block)
      return newBlockWithId
    }
    return block
  }

  async function getTransaction ({ hash }) {
    // Query db/cache to check if block exists
    const transaction = await getTransactionFromStorage({ hash })

    // Block is not available in current storage, query from main net
    if (!transaction) {
      const transaction = await getTransactionFromWeb3({ hash })

      // Block still does not exist, throw error
      if (!transaction) {
        throw new Error(`transaction ${hash} does not exist`)
      }

      // Store new block in the database
      const newTransactionWithId = await postBlock(transaction)
      return newTransactionWithId
    }
    return transaction
  }

  async function getTransactionReceipt ({ hash }) {
    // Query db/cache to check if block exists
    const transactionReceipt = await getTransactionReceiptFromStorage({ hash })

    // Block is not available in current storage, query from main net
    if (!transactionReceipt) {
      const transactionReceipt = await getTransactionReceiptFromWeb3({ hash })

      // Block still does not exist, throw error
      if (!transactionReceipt) {
        throw new Error(`transaction ${hash} does not exist`)
      }

      // Store new block in the database
      const newTransactionReceiptWithId = await postBlock(transactionReceipt)
      return newTransactionReceiptWithId
    }
    return transactionReceipt
  }
 
  // We only expose the APIs we need
  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}
