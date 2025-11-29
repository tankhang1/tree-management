import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Seed = {
  id: string;
  name: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  yield: string; // String to allow units (e.g., "5 tons/ha")
  note: string;
  technicalDoc: string | null; // Filename or URL
  technicalContent: string;
  uniformity: number;
  docType: string;
  imgUrl: string; // Base64 string or URL
};

// Define what is used in the Form (includes raw Files)
export interface SeedFormValues {
  id: string;
  name: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformity: number;
  yield: string;
  note: string;
  docType: string;
  technicalContent: string;
  technicalDocFile: File | null; // For uploading new PDF
  imageFile: File | null; // For uploading new Image
}
interface SeedState {
  seeds: Seed[];
  isLoading: boolean;
  error: string | null;

  fetchSeeds: () => Promise<void>;
  createSeed: (formData: FormData) => Promise<boolean>;
  updateSeed: (id: string, formData: FormData) => Promise<boolean>;
  deleteSeed: (id: string) => Promise<boolean>;
  getSeedById: (id: string) => Seed | undefined;
}

// --- HELPER: Convert File to Base64 ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useSeedStore = create<SeedState>()(
  persist(
    (set, get) => ({
      seeds: [
        {
          id: "DN-DT84",
          name: "Đậu nành DT84",
          supplier: "Trung tâm Giống cây trồng Việt Nam",
          origin: "Việt Nam",
          germinationRate: 90,
          uniformity: 70,
          docType: "file",
          technicalContent: "",
          yield: "2,5 tấn/ha",
          note: "Giống đậu nành ngắn ngày (90–100 ngày), chịu hạn tốt, hạt vàng sáng, dễ canh tác.",
          technicalDoc: "dau-nanh-dt84.pdf",
          imgUrl:
            "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
        },
        {
          id: "DN-DX11",
          name: "Đậu nành ĐX11",
          supplier: "Công ty Mekong Seed",
          origin: "Việt Nam",
          germinationRate: 88,
          uniformity: 72,
          docType: "file",
          technicalContent: "",
          yield: "2,8 tấn/ha",
          note: "Giống cho năng suất cao, hạt to, vỏ vàng, phù hợp nhiều vùng sinh thái khác nhau.",
          technicalDoc: "dau-nanh-dx11.pdf",
          imgUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
        },
        {
          id: "BP-LVN10",
          name: "Bắp LVN10",
          supplier: "Viện Nghiên cứu Ngô Trung ương",
          origin: "Việt Nam",
          germinationRate: 93,
          uniformity: 80,
          docType: "file",
          technicalContent: "",
          yield: "9,5 tấn/ha",
          note: "Giống bắp lai LVN10 sinh trưởng khỏe, kháng sâu bệnh tốt, thời gian sinh trưởng 100–115 ngày.",
          technicalDoc: "bap-lvn10.pdf",
          imgUrl:
            "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
        },
        {
          id: "BP-NK66",
          name: "Bắp NK66",
          supplier: "Syngenta Việt Nam",
          origin: "Thái Lan",
          germinationRate: 91,
          uniformity: 78,
          docType: "file",
          technicalContent: "",
          yield: "10 tấn/ha",
          note: "Giống bắp NK66 chịu hạn tốt, phù hợp vùng Đông Nam Bộ và Tây Nguyên, chất lượng hạt cao.",
          technicalDoc: "bap-nk66.pdf",
          imgUrl:
            "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
        },
        {
          id: "BP-HN68",
          name: "Bắp nếp HN68",
          supplier: "Công ty Giống Cây trồng Trung ương",
          origin: "Việt Nam",
          germinationRate: 89,
          docType: "file",
          technicalContent: "",
          uniformity: 75,
          yield: "8,5 tấn/ha",
          note: "Giống bắp nếp chất lượng cao, hạt dẻo thơm, trắng sữa, thời gian sinh trưởng 95 ngày.",
          technicalDoc: "bap-hn68.pdf",
          imgUrl:
            "https://storage.vinaseed.com.vn/Data/2020/03/10/2-ngo-hn68-637194768462517218.jpg?w=620&h=350",
        },
      ],
      isLoading: false,
      error: null,

      getSeedById: (id) => {
        return get().seeds.find((s) => s.id === id);
      },

      fetchSeeds: async () => {
        // Prevent overwriting if local data exists
        if (get().seeds.length > 0) return;

        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 500));

        // Mock Data
        const MOCK_SEEDS: Seed[] = [
          {
            id: "DN-DT84",
            name: "Đậu nành DT84",
            supplier: "Trung tâm Giống cây trồng Việt Nam",
            origin: "Việt Nam",
            germinationRate: 90,
            uniformity: 70,
            yield: "2,5 tấn/ha",
            note: "Giống đậu nành ngắn ngày...",
            technicalDoc: "dau-nanh-dt84.pdf",
            technicalContent: "",
            docType: "file",
            imgUrl:
              "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
          },
          {
            id: "BP-LVN10",
            name: "Bắp LVN10",
            supplier: "Viện Nghiên cứu Ngô Trung ương",
            origin: "Việt Nam",
            germinationRate: 93,
            uniformity: 80,
            yield: "9,5 tấn/ha",
            note: "Giống bắp lai LVN10 sinh trưởng khỏe...",
            technicalDoc: "bap-lvn10.pdf",
            technicalContent: "",
            docType: "file",
            imgUrl:
              "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
          },
          // ... keep other mock data ...
        ];

        set({ seeds: MOCK_SEEDS, isLoading: false });
      },

      createSeed: async (formData: FormData) => {
        set({ isLoading: true });
        try {
          await new Promise((r) => setTimeout(r, 800));

          // 1. Extract Files
          const imageFile = formData.get("imageFile") as File | null;
          const techFile = formData.get("technicalDoc") as File | null;

          // 2. Process Image
          let finalImgUrl = "https://placehold.co/200x200?text=No+Image";
          console.log("Image File");
          if (imageFile) {
            finalImgUrl = await fileToBase64(imageFile);
          }

          // 3. Process Doc Name
          const docName =
            techFile && techFile instanceof File ? techFile.name : null;

          // 4. Construct Object
          const newSeed: Seed = {
            id: (formData.get("id") as string) || `SR-${Date.now()}`,
            name: formData.get("name") as string,
            supplier: formData.get("supplier") as string,
            origin: formData.get("origin") as string,
            germinationRate: Number(formData.get("germinationRate") || 0),
            uniformity: Number(formData.get("uniformity") || 0), // Added uniformity
            yield: (formData.get("yield") as string) || "", // Kept as string
            note: (formData.get("note") as string) || "",
            docType: (formData.get("docType") as string) || "file",
            technicalContent:
              (formData.get("technicalContent") as string) || "",
            technicalDoc: docName,
            imgUrl: finalImgUrl,
          };

          set((state) => ({
            seeds: [newSeed, ...state.seeds],
            isLoading: false,
          }));

          return true;
        } catch (e) {
          console.error("Create Error:", e);
          set({ isLoading: false, error: "Failed to create seed" });
          return false;
        }
      },

      updateSeed: async (id, formData) => {
        set({ isLoading: true });
        try {
          await new Promise((r) => setTimeout(r, 800));

          const currentSeeds = get().seeds;
          const index = currentSeeds.findIndex((s) => s.id === id);
          if (index === -1) return false;

          const oldSeed = currentSeeds[index];

          // 1. Handle Image Update
          const imageFile = formData.get("image") as File | null;
          let updatedImgUrl = oldSeed.imgUrl;
          if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            updatedImgUrl = await fileToBase64(imageFile);
          }

          // 2. Handle Tech Doc Update
          const techFile = formData.get("technicalDoc") as File | null;
          let updatedDoc = oldSeed.technicalDoc;
          if (techFile && techFile instanceof File && techFile.size > 0) {
            updatedDoc = techFile.name;
          }

          const updatedSeed: Seed = {
            ...oldSeed,
            name: formData.get("name") as string,
            supplier: formData.get("supplier") as string,
            origin: formData.get("origin") as string,
            germinationRate: Number(formData.get("germinationRate")),
            uniformity: Number(formData.get("uniformity")), // Added uniformity
            yield: formData.get("yield") as string, // Fixed: keep as string
            note: formData.get("note") as string,
            docType: formData.get("docType") as string,
            technicalContent: formData.get("technicalContent") as string,
            technicalDoc: updatedDoc,
            imgUrl: updatedImgUrl,
          };

          const newSeedsList = [...currentSeeds];
          newSeedsList[index] = updatedSeed;

          set({ seeds: newSeedsList, isLoading: false });
          return true;
        } catch (e) {
          console.error("Update Error:", e);
          set({ isLoading: false, error: "Failed to update seed" });
          return false;
        }
      },

      deleteSeed: async (id) => {
        set({ isLoading: true });
        try {
          await new Promise((r) => setTimeout(r, 500));
          set((state) => ({
            seeds: state.seeds.filter((s) => s.id !== id),
            isLoading: false,
          }));
          return true;
        } catch (e) {
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "plant-management-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
