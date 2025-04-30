a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/pnl/4QomCnZjhNPrXsm6QM999Eo6ZGtvmyCqeTAhgVdndNcB" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   868  100   868    0     0    123      0  0:00:07  0:00:07 --:--:--   179
{
   "data" : {
      "last2Weeks" : {
         "losingTransactions" : 0,
         "lossRate" : 0,
         "profitableTransactions" : 20,
         "timePeriod" : "last2Weeks",
         "totalPnL" : 92049.63413,
         "totalTransactions" : 20,
         "winRate" : 100
      },
      "last7Days" : {
         "losingTransactions" : 0,
         "lossRate" : 0,
         "profitableTransactions" : 20,
         "timePeriod" : "last7Days",
         "totalPnL" : 92049.63413,
         "totalTransactions" : 20,
         "winRate" : 100
      },
      "lastMonth" : {
         "losingTransactions" : 0,
         "lossRate" : 0,
         "profitableTransactions" : 20,
         "timePeriod" : "lastMonth",
         "totalPnL" : 92049.63413,
         "totalTransactions" : 20,
         "winRate" : 100
      },
      "lastYear" : {
         "losingTransactions" : 0,
         "lossRate" : 0,
         "profitableTransactions" : 20,
         "timePeriod" : "lastYear",
         "totalPnL" : 92049.63413,
         "totalTransactions" : 20,
         "winRate" : 100
      },
      "lifetime" : {
         "losingTransactions" : 0,
         "lossRate" : 0,
         "profitableTransactions" : 20,
         "timePeriod" : "lifetime",
         "totalPnL" : 92049.63413,
         "totalTransactions" : 20,
         "winRate" : 100
      }
   },
   "success" : true
}
a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/pnl/J4gvwiwjhfxHExiF7mH3dBHSgwoqBL7zKSdRDoSBjVFm" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   863  100   863    0     0    839      0  0:00:01  0:00:01 --:--:--   841
{
   "data" : {
      "last2Weeks" : {
         "losingTransactions" : 1,
         "lossRate" : 5,
         "profitableTransactions" : 19,
         "timePeriod" : "last2Weeks",
         "totalPnL" : 11154.443059812,
         "totalTransactions" : 20,
         "winRate" : 95
      },
      "last7Days" : {
         "losingTransactions" : 1,
         "lossRate" : 5,
         "profitableTransactions" : 19,
         "timePeriod" : "last7Days",
         "totalPnL" : 11154.443059812,
         "totalTransactions" : 20,
         "winRate" : 95
      },
      "lastMonth" : {
         "losingTransactions" : 1,
         "lossRate" : 5,
         "profitableTransactions" : 19,
         "timePeriod" : "lastMonth",
         "totalPnL" : 11154.443059812,
         "totalTransactions" : 20,
         "winRate" : 95
      },
      "lastYear" : {
         "losingTransactions" : 1,
         "lossRate" : 5,
         "profitableTransactions" : 19,
         "timePeriod" : "lastYear",
         "totalPnL" : 11154.443059812,
         "totalTransactions" : 20,
         "winRate" : 95
      },
      "lifetime" : {
         "losingTransactions" : 1,
         "lossRate" : 5,
         "profitableTransactions" : 19,
         "timePeriod" : "lifetime",
         "totalPnL" : 11154.443059812,
         "totalTransactions" : 20,
         "winRate" : 95
      }
   },
   "success" : true
}
a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/drawdown/4QomCnZjhNPrXsm6QM999Eo6ZGtvmyCqeTAhgVdndNcB" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1134  100  1134    0     0     72      0  0:00:15  0:00:15 --:--:--   258
{
   "data" : {
      "last2Weeks" : {
         "maxDrawdown" : 89.5131131209522,
         "peakDate" : "2025-04-29T07:29:19.000Z",
         "peakValue" : 45918.195195,
         "recoveryDate" : "2025-04-29T02:59:16.000Z",
         "troughDate" : "2025-04-29T02:59:16.000Z",
         "troughValue" : 4815.389187
      },
      "last7Days" : {
         "maxDrawdown" : 89.5131131209522,
         "peakDate" : "2025-04-29T07:29:19.000Z",
         "peakValue" : 45918.195195,
         "recoveryDate" : "2025-04-29T02:59:16.000Z",
         "troughDate" : "2025-04-29T02:59:16.000Z",
         "troughValue" : 4815.389187
      },
      "lastMonth" : {
         "maxDrawdown" : 89.5131131209522,
         "peakDate" : "2025-04-29T07:29:19.000Z",
         "peakValue" : 45918.195195,
         "recoveryDate" : "2025-04-29T02:59:16.000Z",
         "troughDate" : "2025-04-29T02:59:16.000Z",
         "troughValue" : 4815.389187
      },
      "lastYear" : {
         "maxDrawdown" : 89.5131131209522,
         "peakDate" : "2025-04-29T07:29:19.000Z",
         "peakValue" : 45918.195195,
         "recoveryDate" : "2025-04-29T02:59:16.000Z",
         "troughDate" : "2025-04-29T02:59:16.000Z",
         "troughValue" : 4815.389187
      },
      "lifetime" : {
         "maxDrawdown" : 89.5131131209522,
         "peakDate" : "2025-04-29T07:29:19.000Z",
         "peakValue" : 45918.195195,
         "recoveryDate" : "2025-04-29T02:59:16.000Z",
         "troughDate" : "2025-04-29T02:59:16.000Z",
         "troughValue" : 4815.389187
      }
   },
   "success" : true
}
a@a:~/solanastae$ 






a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/sharpe-ratio/4QomCnZjhNPrXsm6QM999Eo6ZGtvmyCqeTAhgVdndNcB" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   809  100   809    0     0  30380      0 --:--:-- --:--:-- --:--:-- 31115
{
   "data" : {
      "last2Weeks" : {
         "averageReturn" : 0.00735117030719049,
         "riskFreeRate" : 0,
         "sharpeRatio" : 0.284020912016365,
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "last7Days" : {
         "averageReturn" : 0.00735117030719049,
         "riskFreeRate" : 0,
         "sharpeRatio" : 0.284020912016365,
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lastMonth" : {
         "averageReturn" : 0.00735117030719049,
         "riskFreeRate" : 0,
         "sharpeRatio" : 0.284020912016365,
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lastYear" : {
         "averageReturn" : 0.00735117030719049,
         "riskFreeRate" : 0,
         "sharpeRatio" : 0.284020912016365,
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lifetime" : {
         "averageReturn" : 0.00735117030719049,
         "riskFreeRate" : 0,
         "sharpeRatio" : 0.284020912016365,
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      }
   },
   "success" : true
}
a@a:~/solanastae$ 










a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/volatility/4QomCnZjhNPrXsm6QM999Eo6ZGtvmyCqeTAhgVdndNcB" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   379  100   379    0     0  19513      0 --:--:-- --:--:-- --:--:-- 21055
{
   "data" : {
      "last2Weeks" : {
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "last7Days" : {
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lastMonth" : {
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lastYear" : {
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      },
      "lifetime" : {
         "timePeriod" : "lifetime",
         "volatility" : 0.0258824966619603
      }
   },
   "success" : true
}
a@a:~/solanastae$ 




a@a:~/solanastae$ curl -X GET "http://localhost:5000/api/v1/analytics/sortino-ratio/4QomCnZjhNPrXsm6QM999Eo6ZGtvmyCqeTAhgVdndNcB" | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   864  100   864    0     0  22664      0 --:--:-- --:--:-- --:--:-- 23351
{
   "data" : {
      "last2Weeks" : {
         "averageReturn" : 0.00735117030719049,
         "downsideDeviation" : 0.0188578573588203,
         "riskFreeRate" : 0,
         "sortinoRatio" : 0.38982001864343,
         "timePeriod" : "lifetime"
      },
      "last7Days" : {
         "averageReturn" : 0.00735117030719049,
         "downsideDeviation" : 0.0188578573588203,
         "riskFreeRate" : 0,
         "sortinoRatio" : 0.38982001864343,
         "timePeriod" : "lifetime"
      },
      "lastMonth" : {
         "averageReturn" : 0.00735117030719049,
         "downsideDeviation" : 0.0188578573588203,
         "riskFreeRate" : 0,
         "sortinoRatio" : 0.38982001864343,
         "timePeriod" : "lifetime"
      },
      "lastYear" : {
         "averageReturn" : 0.00735117030719049,
         "downsideDeviation" : 0.0188578573588203,
         "riskFreeRate" : 0,
         "sortinoRatio" : 0.38982001864343,
         "timePeriod" : "lifetime"
      },
      "lifetime" : {
         "averageReturn" : 0.00735117030719049,
         "downsideDeviation" : 0.0188578573588203,
         "riskFreeRate" : 0,
         "sortinoRatio" : 0.38982001864343,
         "timePeriod" : "lifetime"
      }
   },
   "success" : true
}
a@a:~/solanastae$ 