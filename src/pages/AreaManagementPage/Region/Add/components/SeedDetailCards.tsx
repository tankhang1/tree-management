import { Group, Text } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import SeedDetailCard from "./SeedDetailCard";
import { useSeedStore, type Seed } from "../../../../zustand/seedStore";
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

interface SeedDetailCardsProps {
  isMultiple?: boolean;
  isTouchable?: boolean;
  isDelete?: boolean;
  // BỔ SUNG PROPS ĐỂ QUẢN LÝ TRẠNG THÁI BÊN NGOÀI
  selected?: string[]; // Danh sách các seedCode đã chọn
  onSelect?: (seed: Seed) => void; // Xử lý khi chọn/bỏ chọn
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
  const { seeds } = useSeedStore();
  // Hàm xử lý việc chọn/bỏ chọn, truyền ra ngoài thông qua onSelect prop
  const handleSelectSeed = (seed: Seed) => {
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
        {seeds.length === 0 && (
          <Text c="dimmed" size="sm" p="md">
            Không có dữ liệu hạt giống chi tiết.
          </Text>
        )}

        {seeds.map((s) => (
          <SeedDetailCard
            key={s.id}
            imageUrl={s.imgUrl}
            seedCode={s.id}
            seedName={s.name}
            supplier={s.supplier}
            origin={s.origin}
            germinationRate={s.germinationRate}
            uniformityRate={s.uniformity}
            yieldPerHectare={s.yield}
            isMultiple={isMultiple}
            // Kiểm tra trạng thái kích hoạt dựa trên selected props
            isActive={selected.includes(s.id)}
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
