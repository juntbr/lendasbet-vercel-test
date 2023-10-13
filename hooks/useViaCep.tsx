// https://github.com/devarthurribeiro/react-via-cep/blob/master/src/components/ViaCep.js

import { doToast } from "../utils/toastOptions";

export type ViaCepData = {
  cep: string;
  logradouro: string;
  complemento: number;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

type ViaCepResponse = {
  data: ViaCepData | null;
  error: boolean;
};
export async function getCep(postalCode: string): Promise<ViaCepResponse> {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);
    const data = await res.json();

    return { data, error: data?.erro && data?.erro };
  } catch (e) {
    doToast("CEP inválido");
    return { data: null, error: true };
  }
}
