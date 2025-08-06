import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
  Autocomplete,
} from "@mantine/core";
import {
  IconUser,
  IconId,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
  IconSearch,
} from "@tabler/icons-react";
import Scrollable from "../Scrollable";
import { useState } from "react";

const data = [
  {
    name: "Hộ ông Nguyễn Văn A",
    type: "hộ nông dân",
    owner: "Nguyễn Văn A",
    id: "012345678901",
    phone: "0912345678",
    email: "a.nongdan@example.com",
    address: "Ấp 1, xã Tân Lập, huyện Hớn Quản, Bình Phước",
  },
  {
    name: "HTX Nông nghiệp Bền Vững",
    type: "hợp tác xã",
    owner: "Trần Thị B",
    id: "123456789012",
    phone: "0938123456",
    email: "info@benvungcoop.vn",
    address: "Xã Phú Riềng, huyện Phú Riềng, Bình Phước",
  },
  {
    name: "Hộ ông Lê Văn C",
    type: "hộ nông dân",
    owner: "Lê Văn C",
    id: "234567890123",
    phone: "0987654321",
    email: "c.nongdan@example.com",
    address: "Ấp 2, xã Tân Hưng, huyện Đồng Phú, Bình Phước",
  },
  {
    name: "HTX Nông nghiệp Xanh",
    type: "hợp tác xã",
    owner: "Nguyễn Thị D",
    id: "345678901234",
    phone: "0901234567",
    email: "info@nongnghiepxanh.vn",
    address: "Xã Tân Tiến, huyện Đồng Xoài, Bình Phước",
  },
  {
    name: "Hộ bà Phạm Thị E",
    type: "hộ nông dân",
    owner: "Phạm Thị E",
    id: "456789012345",
    phone: "0911223344",
    email: "e.nongdan@example.com",
    address: "Ấp 3, xã Minh Hưng, huyện Chơn Thành, Bình Phước",
  },
  {
    name: "HTX Nông nghiệp Hữu Cơ",
    type: "hợp tác xã",
    owner: "Trần Văn F",
    id: "567890123456",
    phone: "0922334455",
    email: "info@huuco.vn",
    address: "Xã Tân Lợi, huyện Hớn Quản, Bình Phước",
  },
  {
    name: "Hộ ông Nguyễn Văn G",
    type: "hộ nông dân",
    owner: "Nguyễn Văn G",
    id: "678901234567",
    phone: "0933445566",
    email: "g.nongdan@example.com",
    address: "Ấp 4, xã Tân Phước, huyện Phú Riềng, Bình Phước",
  },
];

export function CompanyList() {
  const [selectedId, setSelectedId] = useState("");
  return (
    <Stack gap={"xs"}>
      <Text fw={500} fz={15}>
        Doanh nghiệp/ Nông hộ
      </Text>
      <Autocomplete
        placeholder="Tìm doanh nghiệp/ nông hộ"
        leftSection={<IconSearch size={18} />}
        radius={4}
      />
      <Scrollable>
        <Group align="flex-start" wrap="nowrap" gap="md" p={"xs"}>
          {data.map((item, index) => (
            <Card
              key={index}
              shadow="md"
              padding="lg"
              radius={4}
              miw={500}
              h={300}
              onClick={() => setSelectedId(item.id)}
              withBorder
              style={{
                position: "relative",
                transition: "transform 0.2s ease",
                borderColor: selectedId === item.id ? "green" : undefined,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Group justify="space-between">
                <Group>
                  <IconBuilding size={32} />
                  <div>
                    <Text size="lg" fw={700}>
                      {item.name}
                    </Text>
                    <Badge color="green" variant="light" mt={4}>
                      {item.type}
                    </Badge>
                  </div>
                </Group>

                <Tooltip label="Xem chi tiết" withArrow>
                  <ActionIcon
                    color="blue"
                    variant="light"
                    radius="xl"
                    size="lg"
                  >
                    <IconUser />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Stack mt="md" gap="xs">
                <Group>
                  <IconUser size={18} />
                  <Text size="sm">
                    <strong>Chủ sở hữu:</strong> {item.owner}
                  </Text>
                </Group>

                <Group>
                  <IconId size={18} />
                  <Text size="sm">
                    <strong>CCCD/CMND:</strong> {item.id}
                  </Text>
                </Group>

                <Group>
                  <IconPhone size={18} />
                  <Text size="sm">
                    <strong>SĐT:</strong> {item.phone}
                  </Text>
                </Group>

                <Group>
                  <IconMail size={18} />
                  <Text size="sm">
                    <strong>Email:</strong> {item.email}
                  </Text>
                </Group>

                <Group align="start">
                  <IconMapPin size={18} style={{ marginTop: 2 }} />
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {item.address}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </Scrollable>
    </Stack>
  );
}
