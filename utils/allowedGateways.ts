import { GatewayType } from "types/GatewayService";

export function sortByOrder(arr: any[], order: any[]): any[] {
  const orderMap = new Map();
  order.forEach((value, index) => orderMap.set(value, index));

  return arr.sort((a, b) => {
    const indexA = orderMap.get(a.value);
    const indexB = orderMap.get(b.value);

    if (indexA === undefined && indexB === undefined) {
      return 0; // Preserve original order if both elements are not in the order array
    } else if (indexA === undefined) {
      return 1; // Move elements not in the order array to the end
    } else if (indexB === undefined) {
      return -1; // Move elements not in the order array to the end
    } else {
      return indexA - indexB; // Compare indices to determine order
    }
  });
}

export function filterAndSortGateways(
  desiredGateways: string[],
  availableGateways: string[],
): string[] {
  if (desiredGateways.length === 0) {
    // If desiredGateways is empty, return all available gateways
    return availableGateways;
  }
  // Filter out gateways that are not present in availableGateways
  const filteredGateways = desiredGateways.filter((gateway) =>
    availableGateways.includes(gateway),
  );

  // Sort the filtered gateways based on their order in desiredGateways
  const sortedGateways = desiredGateways
    .map((gateway) => (filteredGateways.includes(gateway) ? gateway : null))
    .filter(Boolean);

  return sortedGateways;
}

export default function allowedGateways() {
  const gatewaysEnv: string = process.env.NEXT_PUBLIC_ALLOW_GATEWAYS ?? "";
  const desiredGateways: string[] = gatewaysEnv
    .split(",")
    .map((gateway) => gateway.toUpperCase());
  const availableGateways: string[] = Object.keys(GatewayType);
  const sortedGateways: string[] = filterAndSortGateways(
    desiredGateways,
    availableGateways,
  );

  return sortedGateways;
}
