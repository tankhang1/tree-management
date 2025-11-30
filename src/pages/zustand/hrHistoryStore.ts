import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Các loại đối tượng trong module Nhân sự
export type HREntityType = "Employee" | "Team" | "Department" | "Position";

export interface HistoryLog {
  id: string;
  timestamp: string; // Thời gian thực hiện
  action: string; // Hành động (VD: Thêm mới, Cập nhật)
  targetName: string; // Tên đối tượng bị tác động (VD: Nguyễn Văn A)
  entityType: HREntityType; // Loại đối tượng
  performedBy: string; // Người thực hiện (User đang login)
  details?: string; // Chi tiết bổ sung
}

interface HistoryState {
  logs: HistoryLog[];
  addLog: (log: Omit<HistoryLog, "id" | "timestamp">) => void;
  clearLogs: () => void;
}

// Dữ liệu mẫu
const MOCK_LOGS: HistoryLog[] = [
  {
    id: "LOG-001",
    timestamp: "2023-10-25T08:30:00.000Z",
    action: "Thêm mới nhân sự",
    targetName: "Nguyễn Văn A",
    entityType: "Employee",
    performedBy: "Admin",
    details: "Vị trí: Nhân viên kỹ thuật",
  },
  {
    id: "LOG-002",
    timestamp: "2023-10-26T09:15:00.000Z",
    action: "Tạo nhóm mới",
    targetName: "Nhóm Canh tác",
    entityType: "Team",
    performedBy: "Admin",
    details: "Phòng ban: Kỹ thuật",
  },
];

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      logs: MOCK_LOGS,

      addLog: (logData) =>
        set((state) => ({
          logs: [
            {
              ...logData,
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
            ...state.logs, // Log mới nhất đưa lên đầu
          ],
        })),

      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "hr-history-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
