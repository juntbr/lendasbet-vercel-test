export let stateWithAccents = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" },
  { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" },
  { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" },
];
export let states = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapa", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceara", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espirito Santo", sigla: "ES" },
  { nome: "Goias", sigla: "GO" },
  { nome: "Maranhao", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Para", sigla: "PA" },
  { nome: "Paraiba", sigla: "PB" },
  { nome: "Parana", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piaui", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondonia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "Sao Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" },
];

export function convertStateNameToAccents(stateName: string) {
  const stateWithoutAccent = states.find((state) => state.nome === stateName);
  if (stateWithoutAccent) {
    const stateWithAccent = stateWithAccents.find(
      (state) => state.sigla === stateWithoutAccent.sigla
    );
    if (stateWithAccent) {
      return stateWithAccent.nome;
    }
  }
  return stateName;
}

export function getStateFromSigla(sigla: string) {
  const state = states.find((state) => state.sigla === sigla);
  if (state) {
    return state.nome;
  }
  return sigla;
}

export type Region = {
  id: number;
  name: string;
};

export type Country = {
  code: string;
  name: string;
  phonePrefix: string;
  currency: string;
  legalAge: number;
  regions: Region[];
};

export type CountryRegionsResponse = {
  countries: Country[];
  currentIPCCountry: string;
};
