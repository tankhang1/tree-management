import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CropGroup {
  id: string;
  name: string;
  note: string;
}

interface CropGroupState {
  groups: CropGroup[];
  isLoading: boolean;

  // Actions
  addGroup: (group: CropGroup) => Promise<boolean>;
  updateGroup: (id: string, group: Partial<CropGroup>) => Promise<boolean>;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => CropGroup | undefined;
}

// Dữ liệu mẫu bạn cung cấp
const MOCK_DATA: CropGroup[] = [
  { id: "rice", name: "Lúa", note: "Cây lương thực chính tại Việt Nam." },
  { id: "corn", name: "Bắp (Ngô)", note: "Cây lương thực phổ biến." },
  { id: "soybean", name: "Đậu nành", note: "Cây họ đậu ngắn ngày, giàu đạm." },
  { id: "cassava", name: "Khoai mì", note: "Cây dễ trồng, chịu hạn tốt." },
  {
    id: "sweet_potato",
    name: "Khoai lang",
    note: "Cây trồng ngắn ngày, thích hợp đất cát.",
  },
  { id: "sugarcane", name: "Mía", note: "Nguyên liệu sản xuất đường." },
  { id: "coffee", name: "Cà phê", note: "Cây công nghiệp dài ngày." },
  { id: "rubber", name: "Cao su", note: "Cây lấy mủ công nghiệp." },
  { id: "tea", name: "Chè", note: "Cây công nghiệp và dược liệu." },
  {
    id: "pepper",
    name: "Hồ tiêu",
    note: "Gia vị quan trọng, xuất khẩu nhiều.",
  },
  { id: "dragon_fruit", name: "Thanh long", note: "Cây ăn quả đặc sản." },
];

export const useCropGroupStore = create<CropGroupState>()(
  persist(
    (set, get) => ({
      groups: MOCK_DATA,
      isLoading: false,

      getGroupById: (id) => get().groups.find((g) => g.id === id),

      addGroup: async (group) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500)); // Giả lập delay

        // Kiểm tra trùng ID
        const exists = get().groups.some((g) => g.id === group.id);
        if (exists) {
          set({ isLoading: false });
          return false;
        }

        set((state) => ({
          groups: [group, ...state.groups],
          isLoading: false,
        }));
        return true;
      },

      updateGroup: async (id, updatedData) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, ...updatedData } : g
          ),
          isLoading: false,
        }));
        return true;
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
        }));
      },
    }),
    {
      name: "crop-group-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
