import {
  Card,
  Text,
  Badge,
  Stack,
  Group,
  SimpleGrid,
  Checkbox,
} from "@mantine/core";
import { useState } from "react";

const suppliersData = [
  {
    id: "sup-1",
    name: "Công ty TNHH Nông Nghiệp Xanh",
    type: "Doanh nghiệp",
    representative: "Nguyễn Văn A",
    phone: "0912345678",
    email: "contact@nongnghiepxanh.vn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0312345678",
    sectors: ["Phân bón", "Thuốc BVTV"],
    note: "Đối tác lâu năm",
  },
  {
    id: "sup-2",
    name: "Trần Thị B",
    type: "Cá nhân",
    representative: "Trần Thị B",
    phone: "0987654321",
    email: "",
    address: "Ấp 3, Xã Tân Phú, Huyện Châu Thành, Long An",
    taxCode: "",
    sectors: ["Vật tư nông nghiệp"],
    note: "",
  },
];
type TSelectableSupplierCards = {
  isCheckbox?: boolean;
};
export function SelectableSupplierCards({
  isCheckbox,
}: TSelectableSupplierCards) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {suppliersData.map((s) => (
        <Card
          key={s.id}
          withBorder
          radius="md"
          p="md"
          onClick={() => toggleSelection(s.id)}
          style={{
            cursor: "pointer",
            borderColor: selectedIds.includes(s.id) ? "green" : undefined,
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={600}>{s.name}</Text>
            {isCheckbox && (
              <Checkbox
                checked={selectedIds.includes(s.id)}
                readOnly
                tabIndex={-1}
              />
            )}
          </Group>
          <Stack gap={2}>
            <Text size="sm">
              <strong>Loại:</strong> {s.type}
            </Text>
            <Text size="sm">
              <strong>Người đại diện:</strong> {s.representative}
            </Text>
            <Text size="sm">
              <strong>SĐT:</strong> {s.phone}
            </Text>
            {s.email && (
              <Text size="sm">
                <strong>Email:</strong> {s.email}
              </Text>
            )}
            <Text size="sm">
              <strong>Địa chỉ:</strong> {s.address}
            </Text>
            {s.taxCode && (
              <Text size="sm">
                <strong>Mã số thuế:</strong> {s.taxCode}
              </Text>
            )}
            <Text size="sm">
              <strong>Ngành hàng:</strong>{" "}
              <Group gap={4}>
                {s.sectors.map((sec) => (
                  <Badge key={sec} variant="light" color="green">
                    {sec}
                  </Badge>
                ))}
              </Group>
            </Text>
            {s.note && (
              <Text size="sm" c="dimmed">
                💬 {s.note}
              </Text>
            )}
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
