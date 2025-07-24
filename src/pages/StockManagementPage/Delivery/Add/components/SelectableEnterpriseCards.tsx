import {
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { useState } from "react";

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
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {enterprises.map((e) => (
        <Card
          key={e.id}
          withBorder
          radius="md"
          p="md"
          style={{
            borderColor: selectedIds.includes(e.id) ? "green" : undefined,
          }}
          onClick={() => toggleSelection(e.id)}
        >
          <Group justify="space-between">
            <Title order={5}>{e.name}</Title>
            {isCheckbox && (
              <Checkbox
                checked={selectedIds.includes(e.id)}
                readOnly
                tabIndex={-1}
              />
            )}
          </Group>
          <Stack gap={4} mt="sm">
            <Text size="sm">
              <strong>Loại hình:</strong> {e.type}
            </Text>
            <Text size="sm">
              <strong>Chủ sở hữu:</strong> {e.owner}
            </Text>
            <Text size="sm">
              <strong>CCCD/CMND:</strong> {e.cccd}
            </Text>
            <Text size="sm">
              <strong>Số điện thoại:</strong> {e.phone}
            </Text>
            <Text size="sm">
              <strong>Email:</strong> {e.email}
            </Text>
            <Text size="sm">
              <strong>Địa chỉ:</strong> {e.address}
            </Text>
            {e.taxCode && (
              <Text size="sm">
                <strong>Mã số thuế:</strong> {e.taxCode}
              </Text>
            )}
            <Text size="sm">
              <strong>Số sổ đỏ:</strong> {e.landCode}
            </Text>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
