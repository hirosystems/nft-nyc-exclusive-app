import {
  Block,
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.18.3/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

import { testnetAddresses } from "./lib/addresses.ts";

Clarinet.test({
  name: "it initializes the contract metadata",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    let call = chain.callReadOnlyFn(
      "nft-nyc-exclusive",
      "get-token-uri",
      [types.uint(0)],
      deployer.address
    );

    call.result.expectOk().expectSome().expectAscii("https://www.hiro.so");
  },
});

Clarinet.test({
  name: "it allows the deployer to update the contract metadata",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    // deployer account attempts to update the token metadata
    let block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "set-token-uri",
        [types.ascii("https://www.stacks.co")],
        deployer.address
      ),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;
    result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "it fails when a non-deployer account updates the contract metadata",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    // wallet_1 attempts to update the token metadata
    let block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "set-token-uri",
        [types.ascii("https://www.stacks.co")],
        account.address
      ),
    ]);

    // the contract returns an error
    const result = block.receipts[0].result;

    result.expectErr().expectUint(401);
  },
});

Clarinet.test({
  name: "it mints an NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    // wallet_1 calls the mint function
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // contract returns (ok true)
    const result = block.receipts[0].result;

    result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "it fails to mint if an account already owns a token",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    let block!: Block;

    // wallet_1 attempts to mint twice
    for (let i = 0; i < 2; i++) {
      block = chain.mineBlock([
        Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
      ]);
    }

    // the second block should return an error
    const result = block.receipts[0].result;

    result.expectErr();
  },
});

Clarinet.test({
  name: "it returns the last minted id",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    // wallet_1 mints an nft
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // a call to the get-last-token-id function returns the first id (u1)
    let call = chain.callReadOnlyFn(
      "nft-nyc-exclusive",
      "get-last-token-id",
      [],
      account.address
    );

    call.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "it gets the owner of an NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;
    let account2 = accounts.get("wallet_2")!;

    // wallet_1 and wallet_2 mint an NFT
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account2.address),
    ]);

    // a call to the get-owner function for the second id (u2) returns wallet_2's address
    let call = chain.callReadOnlyFn(
      "nft-nyc-exclusive",
      "get-owner",
      [types.uint(2)],
      account.address
    );

    call.result.expectOk().expectSome().expectPrincipal(account2.address);
  },
});

Clarinet.test({
  name: "it transfers an NFT",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;
    let account2 = accounts.get("wallet_2")!;

    // wallet_1 mints an NFT
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // a call to get-owner for the first id (u1) returns wallet_1's address
    let call = chain.callReadOnlyFn(
      "nft-nyc-exclusive",
      "get-owner",
      [types.uint(1)],
      account.address
    );

    call.result.expectOk().expectSome().expectPrincipal(account.address);

    // wallet_1 transfers the NFT to wallet_2
    block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "transfer",
        [
          types.uint(1),
          types.principal(account.address),
          types.principal(account2.address),
        ],
        account.address
      ),
    ]);

    // the function returns (ok true)
    const result = block.receipts[0].result;

    result.expectOk().expectBool(true);

    // a call to get-owner for the first id (u1) returns wallet_2's address
    call = chain.callReadOnlyFn(
      "nft-nyc-exclusive",
      "get-owner",
      [types.uint(1)],
      account.address
    );

    call.result.expectOk().expectSome().expectPrincipal(account2.address);
  },
});

Clarinet.test({
  name: "it fails if a wallet transfers an NFT to itself",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    // wallet_1 mints an NFT
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // wallet_1 transfers the NFT to wallet_1
    block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "transfer",
        [
          types.uint(1),
          types.principal(account.address),
          types.principal(account.address),
        ],
        account.address
      ),
    ]);

    // the function returns (error u405)
    const result = block.receipts[0].result;

    result.expectErr().expectUint(405);
  },
});

Clarinet.test({
  name: "it fails if a wallet tries to transfer a token it doesn't own",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;
    let account2 = accounts.get("wallet_2")!;

    // wallet_1 mints an NFT
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // wallet_2 transfers the NFT to wallet_2
    block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "transfer",
        [
          types.uint(1),
          types.principal(account.address),
          types.principal(account2.address),
        ],
        account2.address
      ),
    ]);

    // the function returns (error 401)
    const result = block.receipts[0].result;

    result.expectErr().expectUint(401);
  },
});

Clarinet.test({
  name: "it fails if a token doesn't exist",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;
    let account2 = accounts.get("wallet_2")!;

    // wallet_1 mints an NFT with id u1
    let block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // wallet_1 transfers NFT with id u2 to wallet_2
    block = chain.mineBlock([
      Tx.contractCall(
        "nft-nyc-exclusive",
        "transfer",
        [
          types.uint(2),
          types.principal(account.address),
          types.principal(account2.address),
        ],
        account.address
      ),
    ]);

    // the function returns (err 404)
    const result = block.receipts[0].result;

    result.expectErr().expectUint(404);
  },
});

Clarinet.test({
  name: "it stops minting after 1000 tokens have been created",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let account = accounts.get("wallet_1")!;

    let apes = testnetAddresses();

    let block!: Block;

    // each address mints an NFT, exhausting the total supply
    apes.forEach((ape: string) => {
      block = chain.mineBlock([
        Tx.contractCall("nft-nyc-exclusive", "mint", [], ape),
      ]);
    });

    // wallet_1 tries to mint an NFT
    block = chain.mineBlock([
      Tx.contractCall("nft-nyc-exclusive", "mint", [], account.address),
    ]);

    // the contract returns (err 403)
    const result = block.receipts[0].result;

    result.expectErr().expectUint(403);
  },
});
