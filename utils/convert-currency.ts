export const convertCurrency = async (amount: number, currCurrency: string, expectedCurrency: string) => {
  // Example: fetching USD to IDR conversion rate from an API
  const apiKey = 'YOUR_API_KEY'; // Replace with your API key
  const response = await fetch(`https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=${expectedCurrency},${currCurrency}`);
  const data = await response.json();

  const usdToIdrRate = data.rates.expectedCurrency;
  const amountInIDR = amount * usdToIdrRate;

  return amountInIDR; //
}