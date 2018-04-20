/*
 * src/eth-service/route.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 28/12/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import config from '../config'
import { Ok, Err } from '../helper'

export default function Route (model) {
  async function getBlock (req, res) {
    try {
      const result = await model.getBlock(req.params)
      Ok(res)(result)
    } catch (error) {
      Err(res)(error)
    }
  }

  async function getTransaction (req, res) {
    try {
      const result = await model.getTransaction(req.params)
      Ok(res)(result)
    } catch (error) {
      Err(res)(error)
    }
  }

  async function getTransactionReceipt (req, res) {
    try {
      const result = await model.getTransactionReceipt(req.params)
      Ok(res)(result)
    } catch (error) {
      Err(res)(error)
    }
  }

  return {
    getBlock,
    getTransaction,
    getTransactionReceipt
  }
}
