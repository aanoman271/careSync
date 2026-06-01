export type FilterType = "all" | "completed" | "cancelled";

export interface AppointmentHistoryHeaderProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}
