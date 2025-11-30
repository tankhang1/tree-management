import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TeamMember {
  name: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  departments: string[];
  roles: string[];
  members: TeamMember[];
  createdAt: string;
}

interface TeamState {
  teams: Team[];
  isLoading: boolean;
  addTeam: (data: Omit<Team, "id" | "createdAt">) => Promise<boolean>;
  deleteTeam: (id: string) => void;
  fetchTeams: () => Promise<void>;
}

// Dữ liệu mẫu từ code cũ của bạn
const MOCK_TEAMS: Team[] = [
  {
    id: "GR001",
    name: "Nhóm Canh tác",
    description: "Phụ trách chăm sóc và giám sát cây trồng",
    departments: ["Phòng Canh tác", "Phòng Giám sát"],
    roles: ["Giám sát", "Kỹ thuật"],
    members: [
      { name: "Nguyễn Văn A", role: "Trưởng nhóm" },
      { name: "Trần Thị B", role: "Nhân viên" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "GR002",
    name: "Nhóm Vật tư",
    description: "Theo dõi kho và phân phối vật tư",
    departments: ["Phòng Vật tư"],
    roles: ["Kho", "Cung ứng"],
    members: [{ name: "Lê Văn C", role: "Nhân viên kho" }],
    createdAt: new Date().toISOString(),
  },
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: MOCK_TEAMS,
      isLoading: false,

      fetchTeams: async () => {
        if (get().teams.length > 0) return;
        set({ isLoading: true });
        // Giả lập delay
        await new Promise((r) => setTimeout(r, 500));
        set({ teams: MOCK_TEAMS, isLoading: false });
      },

      addTeam: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        const newTeam: Team = {
          ...data,
          id: `GR-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          teams: [newTeam, ...state.teams],
          isLoading: false,
        }));
        return true;
      },

      deleteTeam: (id) => {
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "team-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
