// birthDate necessita estar no formato "yyyy-mm-dd"
export function getAge(birthDate: string) {
  const today = new Date();
  const formattedBirthDate = new Date(birthDate);
  let age = today.getFullYear() - formattedBirthDate.getFullYear();
  const m = today.getMonth() - formattedBirthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < formattedBirthDate.getDate())) {
    age--;
  }

  return age;
}