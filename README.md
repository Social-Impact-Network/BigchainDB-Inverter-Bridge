[![Website](https://img.shields.io/website-up-down-green-red/https/inverter-bigchaindb-bridge.herokuapp.com/.svg?label=inverter-bigchaindb-bridge.herokuapp.com&style=plastic)](https://inverter-bigchaindb-bridge.herokuapp.com/)
[![License](https://img.shields.io/github/license/Social-Impact-Network/Inverter-BigchainDB-Bridge?style=plastic)](https://opensource.org/licenses/MIT)
[![Travis](https://img.shields.io/travis/com/Social-Impact-Network/Inverter-BigchainDB-Bridge/main?style=plastic)](https://www.travis-ci.com/github/Social-Impact-Network/Inverter-BigchainDB-Bridge)
[![GitHub issues](https://img.shields.io/github/issues/Social-Impact-Network/Inverter-BigchainDB-Bridge?style=plastic)](https://github.com/Social-Impact-Network/Inverter-BigchainDB-Bridge/issues)
[![GitHub package version](https://img.shields.io/github/v/release/Social-Impact-Network/Inverter-BigchainDB-Bridge?include_prereleases&style=plastic)](https://github.com/Social-Impact-Network/Inverter-BigchainDB-Bridge/blob/main/package.json)
[![Twitter](https://img.shields.io/twitter/follow/SINetwork1.svg?style=social&label=@SINetwork1)](https://twitter.com/SINetwork1)

## Inverter BigchainDB Bridge

This bridge is used to push impact values from solar inverters to Social Impact Networks every 24 hours. It is implemented to enable the Social Impact Network to track impact values.
The generated impact values are pushed to the specified SI node.

This repo supports the following inverter types:
* All SMA inverters with activated [Sunny Portal] (https://www.sunnyportal.com/).

## Required credentials
Only registered SI Network projects can send impact values to Social Impact Network.
To send impact values to SI Network, the following credentials are required:
* Assigned SI Network Asset ID (Project ID). 
* Social Impact Tracker key pair (authentication of sender).
* Individual inverter credentials: 
  * SMA Inverters: [SunnyPortal](https://www.sunnyportal.com/) credentials and Solar Plant ID needed

SI network Asset ID and  Tracker key pair are manually provided to SI project owners by the Social Impact team.
All credentials must be specified in `.env`.


## Vulnerabilites, Bugs & Feature Request

If you find any vulnerability, bug, or you want a feature added, feel free to submit an issue at [Github Issues](https://github.com/Social-Impact-Network/Inverter-BigchainDB-Bridge/issues)

## Getting started

1. Rename `.sample.env` to `.env` and enter your credentials.
2. Set `apiPath` to API URL of an [active SI Node](https://social-impact-network.github.io/docs/transparent-impact-measurement.html#list-of-active-si-nodes) (Recommendation: use a node owned by the SI Network).
2. Make sure you have the latest LTS version of Node.js and NPM version 6 or greater installed.
2. Open terminal.
3. Clone the repo: `git clone https://github.com/Social-Impact-Network/Inverter-BigchainDB-Bridge.git`.
4. Move to the dictory by running `cd Inverter-BigchainDB-Bridge`.
5. Run `npm install` to install node packages.
6. Run `npm start` to start the bridge.

While the script is running, solar panel impact values are transmitted to SI network via the specified SI node every 24 hours at 3:00 am server's timezone (default: UTC) .



