a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/account-fees/AK2VbkdYLHSiJKS6AGUfNZYNaejABkV6VYDX1Vrgxfo?from=2024-01-01&to=2024-02-01"
[{"tx_fees":19736,"time":"2024-01-01"},{"tx_fees":9467414,"time":"2024-01-02"},{"tx_fees":15119455,"time":"2024-01-03"},{"tx_fees":0,"time":"2024-01-04"},{"tx_fees":15000,"time":"2024-01-05"},{"tx_fees":0,"time":"2024-01-06"},{"tx_fees":0,"time":"2024-01-07"},{"tx_fees":1097400,"time":"2024-01-08"},{"tx_fees":1554309,"time":"2024-01-09"},{"tx_fees":130800,"time":"2024-01-10"},{"tx_fees":15000,"time":"2024-01-11"},{"tx_fees":0,"time":"2024-01-12"},{"tx_fees":96485,"time":"2024-01-13"},{"tx_fees":0,"time":"2024-01-14"},{"tx_fees":1135845,"time":"2024-01-15"},{"tx_fees":537778,"time":"2024-01-16"},{"tx_fees":0,"time":"2024-01-17"},{"tx_fees":0,"time":"2024-01-18"},{"tx_fees":0,"time":"2024-01-19"},{"tx_fees":0,"time":"2024-01-20"},{"tx_fees":19000,"time":"2024-01-21"},{"tx_fees":0,"time":"2024-01-22"},{"tx_fees":0,"time":"2024-01-23"},{"tx_fees":15000,"time":"2024-01-24"},{"tx_fees":0,"time":"2024-01-25"},{"tx_fees":2935290,"time":"2024-01-26"},{"tx_fees":2362820,"time":"2024-01-27"},{"tx_fees":5001,"time":"2024-01-28"},{"tx_fees":0,"time":"2024-01-29"},{"tx_fees":1420380,"time":"2024-01-30"},{"tx_fees":36348392,"time":"2024-01-31"},{"tx_fees":5100,"time":"2024-02-01"}







a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/account-transactions/AK2VbkdYLHSiJKS6AGUfNZYNaejABkV6VYDX1Vrgxfo?limit=10&page=1"
{"error":"No transactions found for the specified account and filters"}a@a:~/solanastae$ 








a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/owner-token-accounts/AK2VbkdYLHSiJKS6AGUfNZYNaejABkV6VYDX1Vrgxfo?tokenType=Fungible"
{"pubkey":"AK2VbkdYLHSiJKS6AGUfNZYNaejABkV6VYDX1Vrgxfo","tokens":{"B71JoYdNrK6hxg8REVihsyk97US7KwjgXLPbbtg8xxzP":{"mint":"B71JoYdNrK6hxg8REVihsyk97US7KwjgXLPbbtg8xxzP","ata":"G2BD8PQF3VcohKPF5yDAKjYEkYTaVePF2nmq4ej3mUz4","balance":1,"tokenData":{"mint":"B71JoYdNrK6hxg8REVihsyk97US7KwjgXLPbbtg8xxzP","decimals":9,"freezeAuthority":null,"mintAuthority":"FGjBXd2qsZ2LBhBFhy4BsYCsi29yrVn5HrRBijmg7HXq","tokenType":"Fungible","tokenMetadata":{"onChainInfo":{"name":null,"symbol":null,"metadata":null,"updateAuthority":null,"isMasterEdition":null,"edition":null,"uri":null,"sellerFeeBasisPoints":null,"primarySaleHappened":null,"isMutable":null,"creators":[],"ruleSet":null,"collection":null,"collectionDetails":null,"uses":null},"offChainInfo":null}}},"ADTv1dri1ymmQjndQPMsmWUwcWbfvPS7siyj7V7EFuP5":{"mint":"ADTv1dri1ymmQjndQPMsmWUwcWbfvPS7siyj7V7EFuP5","ata":"99N8nQAP1RjdXCViVgxGsgihwakPaXvXDXzypc5yN6ZN","balance":0.000028304,"tokenData":{"mint":"ADTv1dri1ymmQjndQPMsmWUwcWbfvPS7siyj7V7EFuP5","decimals":9,"freezeAuthority":null,"mintAuthority":null,"tokenType":"Fungible","tokenMetadata":{"onChainInfo":{"name":null,"symbol":null,"metadata":null,"updateAuthority":null,"isMasterEdition":null,"edition":null,"uri":null,"sellerFeeBasisPoints":null,"primarySaleHappened":null,"isMutable":null,"creators":[],"ruleSet":null,"collection":null,"collectionDetails":null,"uses":null},"offChainInfo":null}}},"CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo":{"mint":"CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo","ata":"Hib8EW6WsTAGyRXLBpFNEo4xgyApRX9eSq7RUdQyFKDN","balance":0.00001,"tokenData":{"mint":"CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo","decimals":5,"freezeAuthority":null,"mintAuthority":null,"tokenType":"Fungible","tokenMetadata":{"onChainInfo":{"name":null,"symbol":null,"metadata":null,"updateAuthority":null,"isMasterEdition":null,"edition":null,"uri":null,"sellerFeeBasisPoints":null,"primarySaleHappened":null,"isMutable":null,"creators":[],"ruleSet":null,"collection":null,"collectionDetails":null,"uses":null},"offChainInfo":null}}}},"message":null}a@a:~/solanastae$ 

CompressedNonFungible, Fungible, Legacy, NonFungible

a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/token-info/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
{"status":"Success","message":"Retrieved Token Info from Token Hash","result":{"tokenHash":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","data":{"mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","tokenName":"USD Coin","symbol":"USDC","decimals":6,"description":"","logo":"https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png","tags":["stablecoin","saber-mkt-usd"],"verified":"true","network":["mainnet"],"metadataToken":""}}}a@a:~/solanastae$ 




a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/token-supply/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
{"circulatingSupply":9279428879.067047,"tokenWithheldAmount":null,"userTotalWithheldAmount":0,"totalWithheldAmount":0,"realCirculatingSupply":9279428879.067047,"decimals":6}a@a:~/solanastae$ 




a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/actions"
["createAccount","assign","transfer","createAccountWithSeed","advanceNonceAccount","withdrawNonceAccount","initializeNonceAccount","authorizeNonceAccount","allocate","allocateWithSeed","assignWithSeed","transferWithSeed","upgradedNonceAccount","purgeAccount","unknownTransfer","initializeMint","initializeAccount","initializeMultisig","transfer","approve","revoke","setAuthority","mintTo","burn","closeAccount","freezeAccount","thawAccount","transferChecked","approveChecked","mintToChecked","burnChecked","initializeAccount2","syncNative","initializeAccount3","initializeMultisig2","initializeMint2","getAccountDataSize","initializeImmutableOwner","amountToUiAmount","uiAmountToAmount","payTxFees","transferCheckedWithFee","withdrawWithheldTokensFromMint","withdrawWithheldTokensFromAccounts","harvestWithheldTokensToMint"]a@a:~/solanastae$ 










a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/solanafm/transfer/XYTAd8UQSiiuyD4FCFFxBcxpkFUWiJJBXpV5uSzZ4UthJKB1zCHtjzvwZkvvJDR12C4yQkQdequ2NkdXXUUmzJw"
{"status":"success","message":"Retrieved Transactions Info","result":{"transactionHash":"XYTAd8UQSiiuyD4FCFFxBcxpkFUWiJJBXpV5uSzZ4UthJKB1zCHtjzvwZkvvJDR12C4yQkQdequ2NkdXXUUmzJw","data":[]}}a@a:~/solanastae$ 







