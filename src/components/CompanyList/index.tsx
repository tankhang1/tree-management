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
];

export function CompanyList() {
  return (
    <Stack gap={"xs"}>
      <Text fw={500} fz={15}>
        Doanh nghiệp/ hộ nông dân (chọn một)
      </Text>
      <Autocomplete
        placeholder="Tìm doanh nghiệp/ hộ nông dân"
        leftSection={<IconSearch size={18} />}
        radius={4}
      />
      <Group gap="md">
        {data.map((item, index) => (
          <Card
            key={index}
            shadow="md"
            padding="lg"
            radius="md"
            withBorder
            style={{ position: "relative", transition: "transform 0.2s ease" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Group justify="space-between">
              <Group>
                <IconBuilding size={32} />
                <div>
                  <Text size="lg" fw={700}>
                    {item.name}
                  </Text>
                  <Badge color="teal" variant="light" mt={4}>
                    {item.type}
                  </Badge>
                </div>
              </Group>

              <Tooltip label="Xem chi tiết" withArrow>
                <ActionIcon color="blue" variant="light" radius="xl" size="lg">
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
    </Stack>
  );
}
