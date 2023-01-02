import { data } from "./jsonMiddleware";

export type Transactions = Array<{ [key: string]: string }>;

function aggregateAmounts(arrayOfTransactions: Transactions): {
  balance: string;
  expense: string;
  revenue: string;
} {
  // const plusHeaders = ["credits", "deposits"];
  // const minusHeaders = ["withdrawals", "charges"];
  let revenue = 0;
  let expense = 0;

  arrayOfTransactions.forEach((obj) => {
    const num = (str: string) => str.replaceAll(/,/g, "");
    const increment: string | undefined =
      obj.credits !== undefined
        ? obj.credits
        : obj.deposits !== undefined
        ? obj.deposits
        : undefined;

    if (increment) {
      // If we are an increment then add it to the total
      revenue += parseFloat(num(increment));
    } else {
      const decrement: string | undefined =
        obj.withdrawals !== undefined
          ? obj.withdrawals
          : obj.charges !== undefined
          ? obj.charges
          : undefined;
      if (decrement === undefined)
        throw Error(
          `No charge or credit was determined for this specific transaction: ${JSON.stringify(
            obj,
            null,
            4
          )}`
        );
      expense += parseFloat(num(decrement));
    }
  });

  return {
    balance: roundAndStringify(revenue - expense),
    expense: roundAndStringify(expense),
    revenue: roundAndStringify(revenue),
  };
}

function concatenateAccountTransactions({
  account,
}: {
  account: string | string[];
}): {
  data: Transactions;
  titles: string[];
} {
  let accountType;
  const accountTransactions: Transactions = data
    .filter((transaction) =>
      account instanceof Array
        ? account.includes(transaction.account)
        : transaction.account === account
    )
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
    throw Error(`Invalid account type attached to account(s): ${account}`);

  return { data: accountTransactions, titles };
}

function deriveUniqueColumnHeaders(
  arrayOfTransactions: Transactions
): string[] {
  const redundantHeaders = ["reference", "trans"];
  const uniqueHeaders = new Set(
    arrayOfTransactions.map((obj) => Object.keys(obj)).flat(2)
  );
  return Array.from(uniqueHeaders).filter(
    (header) => !redundantHeaders.includes(header)
  );
}

function roundAndStringify(num: number): string {
  const rounded = String(Math.round((num + Number.EPSILON) * 100) / 100);
  const notCorrectlyStringified =
    /\.[0-9][0-9]$/g[Symbol.match](rounded) === null;

  if (notCorrectlyStringified) {
    const [whole, decimal] = rounded.split(".");
    return `${whole}.${decimal ? decimal.padEnd(2, "0") : "00"}`;
  }

  return rounded;
}

export {
  aggregateAmounts,
  concatenateAccountTransactions,
  deriveUniqueColumnHeaders,
};
