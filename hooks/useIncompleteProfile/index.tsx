import { useMemo } from "react";
import { useProfileData } from "../useProfileData";

export default function useIncompleteProfile() {
  const { profileData } = useProfileData();

  const incompleteProfile = useMemo(() => {
    if (profileData.address1 !== "officeLendas") {
      return false;
    }
    return true;
  }, [profileData]);

  return { incompleteProfile };
}
