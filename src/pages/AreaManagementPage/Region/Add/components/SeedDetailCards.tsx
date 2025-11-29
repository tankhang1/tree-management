import { Group, Text } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import SeedDetailCard from "./SeedDetailCard";
// import { useState } from "react"; // Loại bỏ useState không cần thiết

// Định nghĩa lại cấu trúc dữ liệu cho Seed Detail
export type SeedDetail = {
  imageUrl: string;
  seedCode: string; // Tạm thời dùng làm ID/Code
  seedName: string;
  supplier: string;
  origin: string;
  germinationRate: number;
  uniformityRate: number;
  yieldPerHectare: string;
};

const soybeanCornSeeds: SeedDetail[] = [
  {
    imageUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    seedCode: "DN-DT84",
    seedName: "Đậu nành DT84",
    supplier: "Trung tâm Giống Cây Trồng",
    origin: "Việt Nam",
    germinationRate: 88,
    uniformityRate: 72,
    yieldPerHectare: "2.2 tấn/ha",
  },
  {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
    seedCode: "DN-DX11",
    seedName: "Đậu nành ĐX11",
    supplier: "Viện KH Nông nghiệp VN",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformityRate: 75,
    yieldPerHectare: "2.4 tấn/ha",
  },
  {
    imageUrl:
      "https://file.hstatic.net/1000034685/file/dau-nanh-gia-si_74da865e5ac14b7a8970b5107fcd422b.jpg",
    seedCode: "DN-HL02",
    seedName: "Đậu nành HL02",
    supplier: "Công ty Giống Hạt Dầu",
    origin: "Việt Nam",
    germinationRate: 92,
    uniformityRate: 78,
    yieldPerHectare: "2.6 tấn/ha",
  },
  {
    imageUrl:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
    seedCode: "BP-LVN10",
    seedName: "Bắp LVN10",
    supplier: "SSC",
    origin: "Việt Nam",
    germinationRate: 94,
    uniformityRate: 80,
    yieldPerHectare: "9.0 tấn/ha",
  },
  {
    imageUrl: "https://anvanthinh.com/multidata/m-yellow-corn-285.jpg",
    seedCode: "BP-VN886",
    seedName: "Bắp vàng VN886",
    supplier: "Trung tâm Giống Quốc gia",
    origin: "Việt Nam",
    germinationRate: 93,
    uniformityRate: 79,
    yieldPerHectare: "8.5 tấn/ha",
  },
];

interface SeedDetailCardsProps {
  isMultiple?: boolean;
  isTouchable?: boolean;
  isDelete?: boolean;
  // BỔ SUNG PROPS ĐỂ QUẢN LÝ TRẠNG THÁI BÊN NGOÀI
  selected?: string[]; // Danh sách các seedCode đã chọn
  onSelect?: (seed: SeedDetail) => void; // Xử lý khi chọn/bỏ chọn
  onDelete?: (seedCode: string) => void; // Xử lý khi nhấn xóa
}

const SeedDetailCards = ({
  isMultiple = false,
  isTouchable = true,
  isDelete = false,
  selected = [], // Danh sách seedCode đã chọn từ bên ngoài
  onSelect,
}: // onDelete, // Không cần thiết ở đây vì logic xóa thường nằm ở component cha
SeedDetailCardsProps) => {
  // Hàm xử lý việc chọn/bỏ chọn, truyền ra ngoài thông qua onSelect prop
  const handleSelectSeed = (seed: SeedDetail) => {
    if (!isTouchable || !onSelect) return;

    // Nếu không cho phép chọn nhiều, chỉ cần gửi code ra ngoài
    if (!isMultiple) {
      onSelect(seed);
      return;
    }

    // Nếu cho phép chọn nhiều: Logic toggle chọn
    // Note: Logic này phải được xử lý ở component cha (ví dụ: Zustand Store)
    // Tuy nhiên, để tiện demo, chúng ta gọi onSelect với code, và component cha sẽ quyết định toggle.
    // Nếu component cha quản lý trạng thái, chỉ cần gọi onSelect(seedCode).
    onSelect(seed);
  };

  return (
    <Scrollable h={320}>
      <Group wrap="nowrap" p="xs">
        {soybeanCornSeeds.length === 0 && (
          <Text c="dimmed" size="sm" p="md">
            Không có dữ liệu hạt giống chi tiết.
          </Text>
        )}

        {soybeanCornSeeds.map((s) => (
          <SeedDetailCard
            key={s.seedCode}
            imageUrl={s.imageUrl}
            seedCode={s.seedCode}
            seedName={s.seedName}
            supplier={s.supplier}
            origin={s.origin}
            germinationRate={s.germinationRate}
            uniformityRate={s.uniformityRate}
            yieldPerHectare={s.yieldPerHectare}
            isMultiple={isMultiple}
            // Kiểm tra trạng thái kích hoạt dựa trên selected props
            isActive={selected.includes(s.seedCode)}
            onClick={() => handleSelectSeed(s)} // Gửi sự kiện ra ngoài
            isDelete={isDelete}
            // Giả định SeedDetailCard cũng nhận onDelete,
            // nếu không dùng, cần xóa prop này đi hoặc tạo hàm handleDelete
            // onDelete={() => onDelete?.(s.seedCode)}
          />
        ))}
      </Group>
    </Scrollable>
  );
};

export default SeedDetailCards;
