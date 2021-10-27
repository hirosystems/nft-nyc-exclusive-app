#!/usr/bin/env node

const axios = require("axios");
const fs = require("fs");

async function getTxns(length) {
  try {
    uniqueAddresses = [];
    offset = 0;

    while (uniqueAddresses.length < length) {
      const res = await axios.get(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/tx?limit=200&offset=${offset}`
      );

      res.data.results.forEach((result) => {
        if (!uniqueAddresses.includes(result.sender_address)) {
          uniqueAddresses.push(result.sender_address);
          console.log(result.sender_address);
        }
      });

      offset += 200;
    }

    fs.writeFile(
      "./addresses.json",
      JSON.stringify(uniqueAddresses),
      "utf8",
      function (err) {
        if (err) {
          return console.error(err);
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
}

getTxns(1000);
