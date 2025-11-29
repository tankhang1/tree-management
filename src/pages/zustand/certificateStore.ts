import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Certificate {
  id: string;
  orgName: string;
  orgLogo: string; // Base64
  certCode: string;
  certName: string;
  issueDate: string;
  validYears: number;
  definition: string;
  contentType: "file" | "editor";
  content: string; // Base64 PDF hoặc HTML string
  targets: string[]; // Danh sách ID cây trồng/vật nuôi được áp dụng
  createdAt: string;
}

interface CertificateState {
  certificates: Certificate[];
  isLoading: boolean;
  addCertificate: (data: Omit<Certificate, "createdAt">) => Promise<boolean>;
  deleteCertificate: (id: string) => void;
}
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "GCN-001",
    orgName: "Tổ chức VietGAP",
    orgLogo:
      "https://cdn.thuvienphapluat.vn/phap-luat/2022-2/HD/chung-nhan-vietgap.jpg",
    certCode: "VG-2025-001",
    certName: "Chứng nhận VietGAP Trồng trọt",
    issueDate: "2025-01-15T00:00:00.000Z",
    validYears: 3,
    definition: "Thực hành sản xuất nông nghiệp tốt tại Việt Nam.",
    contentType: "editor",
    content:
      "<p>Chứng nhận đạt chuẩn VietGAP cho quy trình trồng sầu riêng.</p>",
    targets: [],
    createdAt: "2025-01-10T00:00:00.000Z",
  },

  {
    id: "GCN-002",
    orgName: "Organic Vietnam",
    orgLogo:
      "https://file.hstatic.net/200000423303/article/nn_huuco_8ad18ec91a174544837c5d06217ee34a_grande.jpg",
    certCode: "ORG-2025-002",
    certName: "Chứng nhận Hữu cơ",
    issueDate: "2025-02-20T00:00:00.000Z",
    validYears: 2,
    definition: "Sản xuất theo phương pháp hữu cơ, không sử dụng hóa chất.",
    contentType: "file",
    content: "",
    targets: [],
    createdAt: "2025-02-18T00:00:00.000Z",
  },

  {
    id: "GCN-003",
    orgName: "GlobalG.A.P.",
    orgLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQTSd8fBayOqHlXNRpk9PKWD9QaGja-EU4eD-JRYPTeBY5VQ0iWvJh1sOS9I4N0zpeUnU&usqp=CAU",
    certCode: "GG-2024-999",
    certName: "GlobalGAP",
    issueDate: "2024-12-01T00:00:00.000Z",
    validYears: 1,
    definition: "Tiêu chuẩn thực hành nông nghiệp tốt toàn cầu.",
    contentType: "editor",
    content:
      "<ul><li>An toàn thực phẩm</li><li>Bảo vệ môi trường</li><li>Sức khỏe người lao động</li></ul>",
    targets: [],
    createdAt: "2024-11-25T00:00:00.000Z",
  },

  {
    id: "GCN-004",
    orgName: "Rainforest Alliance",
    orgLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzSIkrhyLPEho3buFO9MzWV32V-IbQ-HJTq6k6nYSoePDUp1ei_2ux5QP6AWMae6SzEJCyr73F6hNg5cM4IfE2z782eaLTZoHc8aVTuIY&s=10",
    certCode: "RA-2023-111",
    certName: "Rainforest Alliance Certified",
    issueDate: "2023-09-10T00:00:00.000Z",
    validYears: 3,
    definition:
      "Chứng nhận bảo vệ rừng, môi trường và phúc lợi người lao động.",
    contentType: "editor",
    content:
      "<p>Sản phẩm được sản xuất theo tiêu chuẩn bảo vệ rừng và hệ sinh thái.</p>",
    targets: [],
    createdAt: "2023-09-01T00:00:00.000Z",
  },
];

export const useCertificateStore = create<CertificateState>()(
  persist(
    (set) => ({
      certificates: MOCK_CERTIFICATES,
      isLoading: false,

      addCertificate: async (data) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000)); // Fake delay
        set((state) => ({
          certificates: [
            { ...data, createdAt: new Date().toISOString() },
            ...state.certificates,
          ],
          isLoading: false,
        }));
        return true;
      },

      deleteCertificate: (id) => {
        set((state) => ({
          certificates: state.certificates.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "certificate-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
