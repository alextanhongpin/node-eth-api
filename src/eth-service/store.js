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
  // When calling external services, prefix the function with fetch
  // e.g. When calling food service
  // async function fetchFood () {
  //  return request('http://localhost:3000/foods/1')
  // }

  // one, all, create, update, delete, count, search is reserved for DB only operation
  async function getBlock ({ number }) {
    return {}
  }
 
  async function getTransaction ({ hash }) {
    return {}
  }
 
  async function getTransactionReceipt ({ hash }) {
    return {}
  }
 
  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}
