// q2.ts
enum Cities {
  Tokyo = "Population: 37,400,000",
  Delhi = "Population: 31,000,000",
  Shanghai = "Population: 27,000,000",
  SãoPaulo = "Population: 22,000,000",
  MexicoCity = "Population: 21,650,000",
}

// Export the cities enumeration
export const cityData = Object.entries(Cities).map(([name, population]) => ({
  name,
  population,
}));
