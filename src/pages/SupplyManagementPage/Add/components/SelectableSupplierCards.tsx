import { Card, Text, Badge, Stack, Group, Checkbox } from "@mantine/core";
import { useState } from "react";
import Scrollable from "../../../../components/Scrollable";

export const suppliersData = [
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
  {
    id: "sup-3",
    name: "Công ty Cổ phần Nông Sản Việt",
    type: "Doanh nghiệp",
    representative: "Lê Văn C",
    phone: "0934567890",
    email: "info@nongsanviet.vn",
    address: "456 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    taxCode: "0319876543",
    sectors: ["Hạt giống", "Phân bón"],
    note: "Chuyên cung cấp giống cây trồng chất lượng cao",
  },
  {
    id: "sup-4",
    name: "Nguyễn Thị D",
    type: "Cá nhân",
    representative: "Nguyễn Thị D",
    phone: "0901234567",
    email: "nguyenthid@example.com",
    address: "Thôn 2, Xã Hòa Bình, Huyện Xuyên Mộc, Bà Rịa - Vũng Tàu",
    taxCode: "",
    sectors: ["Thuốc BVTV"],
    note: "Nhà cung cấp mới",
  },
  {
    id: "sup-5",
    name: "Công ty TNHH Vật Tư Nông Nghiệp Miền Tây",
    type: "Doanh nghiệp",
    representative: "Phạm Văn E",
    phone: "0945678901",
    email: "contact@vatutumientay.vn",
    address: "789 Đường Nguyễn Huệ, TP. Cần Thơ",
    taxCode: "1801234567",
    sectors: ["Phân bón", "Vật tư nông nghiệp"],
    note: "Đối tác chiến lược tại khu vực miền Tây",
  },
  {
    id: "sup-6",
    name: "Hợp tác xã Nông Nghiệp Hữu Cơ",
    type: "Hợp tác xã",
    representative: "Trần Văn F",
    phone: "0976543210",
    email: "info@huuco.vn",
    address: "Xã Tân Lập, Huyện Hớn Quản, Bình Phước",
    taxCode: "3801234567",
    sectors: ["Hạt giống", "Phân bón hữu cơ"],
    note: "Chuyên cung cấp sản phẩm hữu cơ",
  },
  {
    id: "sup-7",
    name: "Công ty TNHH Thương Mại Nông Nghiệp Bắc Trung Bộ",
    type: "Doanh nghiệp",
    representative: "Hoàng Thị G",
    phone: "0923456789",
    email: "contact@nongnghiepbac.vn",
    address: "123 Đường Lý Thường Kiệt, TP. Vinh, Nghệ An",
    taxCode: "2901234567",
    sectors: ["Thuốc BVTV", "Vật tư nông nghiệp"],
    note: "",
  },
  {
    id: "sup-8",
    name: "Công ty Cổ phần Nông Nghiệp Xanh Miền Trung",
    type: "Doanh nghiệp",
    representative: "Võ Văn H",
    phone: "0919876543",
    email: "info@nongnghiepxanhmt.vn",
    address: "456 Đường Hùng Vương, TP. Đà Nẵng",
    taxCode: "0401234567",
    sectors: ["Phân bón", "Hạt giống"],
    note: "Đối tác cung cấp phân bón chính",
  },
  {
    id: "sup-9",
    name: "Nguyễn Văn I",
    type: "Cá nhân",
    representative: "Nguyễn Văn I",
    phone: "0938765432",
    email: "",
    address: "Ấp 5, Xã Tân Hưng, Huyện Đồng Phú, Bình Phước",
    taxCode: "",
    sectors: ["Vật tư nông nghiệp"],
    note: "",
  },
  {
    id: "sup-10",
    name: "Công ty TNHH Nông Nghiệp Phát Triển Bền Vững",
    type: "Doanh nghiệp",
    representative: "Lê Thị J",
    phone: "0908765432",
    email: "contact@benvung.vn",
    address: "789 Đường Phạm Văn Đồng, TP. Hà Nội",
    taxCode: "0101234567",
    sectors: ["Phân bón hữu cơ", "Hạt giống"],
    note: "Đối tác cung cấp sản phẩm chất lượng cao",
  },
];
type TSelectableSupplierCards = {
  isCheckbox?: boolean;
  isMultiple?: boolean;
};
export function SelectableSupplierCards({
  isCheckbox,
  isMultiple = true,
}: TSelectableSupplierCards) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (!isMultiple) {
      setSelectedIds([id]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Scrollable h={290}>
      <Group wrap="nowrap" gap="md" p={"xs"}>
        {suppliersData.map((s) => (
          <Card
            key={s.id}
            withBorder
            radius="md"
            miw={400}
            h={270}
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
      </Group>
    </Scrollable>
  );
}
