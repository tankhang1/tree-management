import { Card, Checkbox, Group, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import Scrollable from "../../../../../components/Scrollable";

const enterprises = [
  {
    id: "ent-1",
    name: "Hộ ông Nguyễn Văn A",
    type: "hộ nông dân",
    owner: "Nguyễn Văn A",
    cccd: "012345678901",
    phone: "0912345678",
    email: "a.nongdan@example.com",
    address: "Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
    taxCode: "",
    landCode: "CN123456789",
  },
  {
    id: "ent-2",
    name: "HTX Nông nghiệp Bền Vững",
    type: "hợp tác xã",
    owner: "Trần Thị B",
    cccd: "123456789012",
    phone: "0938123456",
    email: "info@benvungcoop.vn",
    address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
    taxCode: "0401234567",
    landCode: "HTX-98765432",
  },
  {
    id: "ent-3",
    name: "Công ty TNHH Nông Nghiệp Xanh",
    type: "doanh nghiệp",
    owner: "Lê Văn C",
    cccd: "234567890123",
    phone: "0987654321",
    email: "contact@nongnghiepxanh.vn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0312345678",
    landCode: "DN123456789",
  },
  {
    id: "ent-4",
    name: "Hộ bà Phạm Thị D",
    type: "hộ nông dân",
    owner: "Phạm Thị D",
    cccd: "345678901234",
    phone: "0901234567",
    email: "phamthid@example.com",
    address: "Thôn 2, xã Hòa Bình, huyện Xuyên Mộc, Bà Rịa - Vũng Tàu",
    taxCode: "",
    landCode: "CN987654321",
  },
  {
    id: "ent-5",
    name: "HTX Nông nghiệp Miền Tây",
    type: "hợp tác xã",
    owner: "Nguyễn Văn E",
    cccd: "456789012345",
    phone: "0945678901",
    email: "info@mientaycoop.vn",
    address: "Xã Tân Phú, huyện Châu Thành, Long An",
    taxCode: "1801234567",
    landCode: "HTX-12345678",
  },
  {
    id: "ent-6",
    name: "Công ty Cổ phần Nông Sản Việt",
    type: "doanh nghiệp",
    owner: "Trần Văn F",
    cccd: "567890123456",
    phone: "0934567890",
    email: "info@nongsanviet.vn",
    address: "456 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    taxCode: "0319876543",
    landCode: "DN987654321",
  },
  {
    id: "ent-7",
    name: "Hộ ông Lê Văn G",
    type: "hộ nông dân",
    owner: "Lê Văn G",
    cccd: "678901234567",
    phone: "0919876543",
    email: "levang@example.com",
    address: "Ấp 5, xã Tân Hưng, huyện Đồng Phú, Bình Phước",
    taxCode: "",
    landCode: "CN567890123",
  },
  {
    id: "ent-8",
    name: "HTX Nông nghiệp Hữu Cơ",
    type: "hợp tác xã",
    owner: "Nguyễn Thị H",
    cccd: "789012345678",
    phone: "0976543210",
    email: "info@huuco.vn",
    address: "Xã Tân Lập, huyện Hớn Quản, Bình Phước",
    taxCode: "3801234567",
    landCode: "HTX-87654321",
  },
  {
    id: "ent-9",
    name: "Công ty TNHH Phát Triển Bền Vững",
    type: "doanh nghiệp",
    owner: "Phạm Văn I",
    cccd: "890123456789",
    phone: "0908765432",
    email: "contact@benvung.vn",
    address: "789 Đường Phạm Văn Đồng, TP. Hà Nội",
    taxCode: "0101234567",
    landCode: "DN345678901",
  },
  {
    id: "ent-10",
    name: "Hộ bà Nguyễn Thị J",
    type: "hộ nông dân",
    owner: "Nguyễn Thị J",
    cccd: "901234567890",
    phone: "0923456789",
    email: "nguyenthij@example.com",
    address: "Thôn 3, xã Tân Thành, huyện Bù Đăng, Bình Phước",
    taxCode: "",
    landCode: "CN234567890",
  },
];

type TEnterprise = {
  isCheckbox?: boolean;
  isMulti?: boolean;
};
export function SelectableEnterpriseCards({
  isCheckbox = true,
  isMulti = true,
}: TEnterprise) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (!isMulti) {
      setSelectedIds([id]);
      return;
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  return (
    <Scrollable h={280}>
      <Group wrap="nowrap" align="flex-start" gap={"md"} p={"xs"}>
        {enterprises.map((e) => (
          <Card
            h={270}
            miw={350}
            key={e.id}
            withBorder
            radius={8}
            p="lg"
            style={{
              borderColor: selectedIds.includes(e.id) ? "#4caf50" : "#e0e0e0",
              position: "relative",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = selectedIds.includes(e.id)
                ? "0 4px 8px rgba(76, 175, 80, 0.4)"
                : "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
            onClick={() => toggleSelection(e.id)}
          >
            <Group justify="space-between">
              <Title order={5} style={{ color: "#333", fontWeight: 600 }}>
                {e.name}
              </Title>
              {isCheckbox && (
                <Checkbox
                  checked={selectedIds.includes(e.id)}
                  readOnly
                  onChange={() => {}}
                  tabIndex={-1}
                  style={{ cursor: "default" }}
                />
              )}
            </Group>
            <Stack gap={6} mt="sm">
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Loại hình:</strong> {e.type}
              </Text>
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Chủ sở hữu:</strong> {e.owner}
              </Text>
              <Text size="sm" style={{ color: "#555" }}>
                <strong>CCCD/CMND:</strong> {e.cccd}
              </Text>
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Số điện thoại:</strong> {e.phone}
              </Text>
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Email:</strong> {e.email}
              </Text>
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Địa chỉ:</strong> {e.address}
              </Text>
              {e.taxCode && (
                <Text size="sm" style={{ color: "#555" }}>
                  <strong>Mã số thuế:</strong> {e.taxCode}
                </Text>
              )}
              <Text size="sm" style={{ color: "#555" }}>
                <strong>Số sổ đỏ:</strong> {e.landCode}
              </Text>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
