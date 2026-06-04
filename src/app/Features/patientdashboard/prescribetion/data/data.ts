import { IPopulatedPrescription } from "@/types/prescribetion";
import { AxiosInstance } from "axios";

export const getPrescriptionsData = async (
  axios: AxiosInstance,
): Promise<IPopulatedPrescription[]> => {
  const res = await axios.get("/api/prescribetion");
  return res.data?.data || [];
};
