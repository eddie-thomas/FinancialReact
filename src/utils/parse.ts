import data from "../json/data.json";

function concatenateAccountTransactions({ account }: { account: string }): {
  data: Array<{ [key: string]: string }>;
  titles: string[];
} {
  let accountType;
  const accountTransactions: Array<{ [key: string]: string }> = data
    .filter((transaction) => transaction.account === account)
    .map((transaction) => {
      accountType = transaction.type;
      return JSON.parse(transaction.data);
    })
    .flat();
  const titles = deriveUniqueColumnHeaders(accountTransactions);

  if (accountType === "checking") {
    return {
      data: accountTransactions.sort(({ date: dateA }, { date: dateB }) => {
        const dates = [new Date(dateA), new Date(dateB)];
        return dates[0].getMilliseconds() - dates[1].getMilliseconds();
      }),
      titles,
    };
  } else if (accountType === "credit") {
    return { data: accountTransactions, titles };
  }

  if (accountTransactions.length)
    throw Error(`Invalid account type attached to account: ${account}`);

  return { data: accountTransactions, titles };
}

function deriveUniqueColumnHeaders(
  arrayOfTransactions: Array<{ [key: string]: string }>
): string[] {
  const redundantHeaders = ["reference", "trans"];
  const uniqueHeaders = new Set(
    arrayOfTransactions.map((obj) => Object.keys(obj)).flat(2)
  );
  return Array.from(uniqueHeaders).filter(
    (header) => !redundantHeaders.includes(header)
  );
}

export { concatenateAccountTransactions, deriveUniqueColumnHeaders };
