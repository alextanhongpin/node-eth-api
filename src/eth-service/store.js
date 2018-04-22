/*
 * src/eth-service/store.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 28/12/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

export default function Store ({ db, web3 }) {
  // NOTE: In large scale projects, it might be more sensible to separate the read/write at the
  // code level, as well as the database user

  // Reads

  // Source: Web3

  async function getBlockFromWeb3 ({ number }) {
    return web3.eth.getBlock(number)
  }

  async function getTransactionFromWeb3 ({ hash }) {
    return web3.eth.getTransaction(hash)
  }

  async function getTransactionReceiptFromWeb3 ({ hash }) {
    return web3.eth.getTransactionReceipt(hash)
  }

  // Source: Database

  async function getBlockFromStorage ({ number }) {
    const [rows] = await db.query('SELECT * FROM block WHERE number = ?', [number])
    return (rows && rows[0]) || null
  }

  async function getTransactionFromStorage ({ hash }) {
    const [rows] = await db.query('SELECT * FROM transaction WHERE hash = ?', [hash])
    return (rows && rows[0]) || null
  }

  async function getTransactionReceiptFromStorage ({ hash }) {
    const [rows] = await db.query('SELECT * FROM transactionReceipt WHERE transactionHash = ?', [hash])
    return (rows && rows[0]) || null
  }

  // Writes

  async function postBlock (block) {
    const keys = Object.keys(block).join(', ')
    const valuePlaceholders = Array(Object.keys(block).length).fill('?').join(', ')
    const values = Object.values(block)
    const statement = `INSERT INTO block (${keys}) VALUES (${valuePlaceholders})`
    console.log('statement', statement)
    const [ rows ] = await db.query(statement, values)
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

  // We only expose the APIs we need
  return {
    // Read
    getBlockFromWeb3,
    getTransactionFromWeb3,
    getTransactionReceiptFromWeb3,
    getBlockFromStorage,
    getTransactionFromStorage,
    getTransactionReceiptFromStorage,
    // Writes
    postBlock,
    postTransaction,
    postTransactionReceipt
  }
}
