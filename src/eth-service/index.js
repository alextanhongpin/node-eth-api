/*
 * src/eth-service/index.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 28/12/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import Store from './store'
import Model from './model'
import Route from './route'

import express from 'express'
const router = express.Router()

function Service ({ db, schema }) {
  const store = Store(db)
  const model = Model({ store, schema })
  const route = Route(model)

  router
    .get('/blocks/:number', route.getBlock)
    .get('/transactions/:hash', route.getTransaction)
    .get('/transactions/:hash/receipts', route.getTransactionReceipt)

  return router
}

export default (options) => {
  return {
    route: Service(options)
  }
}
