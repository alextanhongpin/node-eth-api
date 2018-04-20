/*
 * src/config/index.js
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created by Alex Tan Hong Pin 17/10/2017
 * Copyright (c) 2017 alextanhongpin. All rights reserved.
**/

import convict from 'convict'

import DB from './database'

const PORT = {
  doc: 'The port to bind',
  format: 'port',
  default: process.env.PORT,
  env: 'PORT'
}

const WEB3_PROVIDER = {
  doc: 'The http provider for web3',
  format: 'url',
  default: 'http://localhost:8545',
  env: 'WEB3_PROVIDER'
}

const ERC20_CONTRACT = {
  doc: 'The ERC20 contract',
  format: String,
  default: process.env.ERC20_CONTRACT,
  env: 'ERC20_CONTRACT'
}

const config = convict({
  port: PORT,
  web3Provider: WEB3_PROVIDER,
  erc20Contract: ERC20_CONTRACT,
  db: DB
})

const validated = config.validate({ allowed: 'strict' })

export default validated
