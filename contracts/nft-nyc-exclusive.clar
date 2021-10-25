(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)
(define-non-fungible-token nft-nyc-exclusive uint)

;; Limited to first 1000 users
(define-constant MAX-TOKENS u1000)
(define-constant CONTRACT-OWNER tx-sender)

;; Error handling
(define-constant ERR-ALL-MINTED (err u403))     ;; no more tokens available
(define-constant ERR-NOT-AUTHORIZED (err u401)) ;; unauthorized
(define-constant ERR-NOT-FOUND (err u404))      ;; not found
(define-constant ERR-SELF-TRANSFER (err u405))  ;; method not allowed
(define-constant ERR-ALREADY-OWNED (err u409))  ;; conflict

;; Storage
(define-map tokens-count principal uint)
(define-data-var last-id uint u0)
(define-data-var token-uri (string-ascii 256) "")

;; Gets the owner of the specified token ID.
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? nft-nyc-exclusive token-id)))

;; Gets the last token ID.
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get token-uri))))

(define-public (set-token-uri (value (string-ascii 256)))
  (if (is-eq tx-sender CONTRACT-OWNER)
    (ok (var-set token-uri value))
    (err ERR-NOT-AUTHORIZED)
  )
)

;; Transfers tokens to a specified principal.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender sender))
      (match (nft-transfer? nft-nyc-exclusive token-id sender recipient)
        success (ok success)
        error (nft-transfer-err error))
      ERR-NOT-AUTHORIZED))

;; Claim a new nft-nyc-exclusive token.
(define-public (claim-swag)
  (if 
    (and 
      (< (var-get last-id) MAX-TOKENS)
      (is-eq (balance-of tx-sender) u0))
        (ok (mint tx-sender))
        (err ERR-ALL-MINTED)))

(define-private (nft-transfer-err (code uint))
  (if (is-eq u1 code)
    ERR-NOT-AUTHORIZED
    (if (is-eq u2 code)
      ERR-SELF-TRANSFER
      (if (is-eq u3 code)
        ERR-NOT-FOUND
        (err code)))))

(define-private (nft-mint-err (code uint))
  (if (is-eq u1 code)
    ERR-ALREADY-OWNED
    (err code)))

;; Internal - Gets the amount of tokens owned by the specified address.
(define-private (balance-of (account principal))
  (default-to u0 (map-get? tokens-count account)))

;; Internal - Register token
(define-private (mint (new-owner principal))
    (let ((current-balance (balance-of new-owner)) (next-id (+ u1 (var-get last-id))))
      (match (nft-mint? nft-nyc-exclusive next-id new-owner)
        success
          (begin
            (map-set tokens-count
              new-owner
              (+ u1 current-balance))
            (var-set last-id next-id)
            (ok success))
        error (nft-mint-err error))))

;; initialize
(var-set token-uri "https://www.hiro.so/")