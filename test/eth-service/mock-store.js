/*
 * test/eth-service/mock-store.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 30/10/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

// Import mock dataset
import b1 from '../data/block-625106.json'
import b2 from '../data/block-689811.json'
import t1 from '../data/transaction-0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858.json'
import t2 from '../data/transaction-0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad.json'
import tr1 from '../data/transaction-receipt-0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858.json'
import tr2 from '../data/transaction-receipt-0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad.json'

const MockStore = () => {
  // This is an example on how we mock our database dependencies
  // Since the model contains all the business logic and validation,
  // we can guarantee that store will return a data when the payload
  // is valid, and null if the payload is not valid
  async function getBlock ({ number }) {
    const blocks = {
      625106: b1,
      689811: b2
    }
    // If the block exists, return the json payload, else return null
    return blocks[number] || null
  }

  async function getTransaction ({ hash }) {
    const transactions = {
      '0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858': t1,
      '0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad': t2
    }
    return transactions[hash] || null
  }


  async function getTransactionReceipt ({ hash }) {
    const transactions = {
      '0x56215fd919232eadcf3afd9a3179fa71d5bc6dc5b8411bbb9d9a9d28f7a83858': tr1,
      '0xe95f2bef356edf781d71ee81934742aff694ac2fcaab17e05d8ab4b7c43f8fad': tr2
    }
    return transactions[hash] || null
  }

  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}

export default () => MockStore()
