import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Tooltip,
  ActionIcon,
  Autocomplete,
  ScrollArea,
} from "@mantine/core";
import {
  IconBuildingFactory,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconIdBadge,
  IconSearch,
} from "@tabler/icons-react";

const suppliers = [
  {
    code: "SUP001",
    name: "Công ty TNHH Nông Nghiệp Xanh",
    type: "Doanh nghiệp",
    representative: "Nguyễn Văn A",
    phone: "0912345678",
    email: "contact@nongnghiepxanh.vn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  },
  {
    code: "SUP002",
    name: "Trần Thị B",
    type: "Cá nhân",
    representative: "Trần Thị B",
    phone: "0987654321",
    email: "",
    address: "Ấp 3, Xã Tân Phú, Huyện Châu Thành, Long An",
  },
  {
    code: "SUP002",
    name: "Trần Thị B",
    type: "Cá nhân",
    representative: "Trần Thị B",
    phone: "0987654321",
    email: "",
    address: "Ấp 3, Xã Tân Phú, Huyện Châu Thành, Long An",
  },
];

export function VendorList() {
  return (
    <Stack gap={"xs"}>
      <Text fw={500} fz={15}>
        Chọn nhà cung cấp (chọn một)
      </Text>
      <Autocomplete
        placeholder="Tìm nhà cung cấp"
        leftSection={<IconSearch size={18} />}
        radius={4}
      />
      <ScrollArea pb={"lg"} offsetScrollbars>
        <Group wrap="nowrap" gap="md">
          {suppliers.map((sup, index) => (
            <Card
              miw={400}
              h={250}
              key={index}
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between">
                <Group>
                  <IconBuildingFactory size={32} />
                  <div>
                    <Text size="lg" fw={700}>
                      {sup.name}
                    </Text>
                    <Badge
                      color={sup.type === "Doanh nghiệp" ? "blue" : "orange"}
                      variant="light"
                      mt={4}
                    >
                      {sup.type}
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
                    <IconIdBadge />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Stack mt="md" gap="xs">
                <Group>
                  <IconIdBadge size={18} />
                  <Text size="sm">
                    <strong>Mã nhà cung cấp:</strong> {sup.code}
                  </Text>
                </Group>

                <Group>
                  <IconUser size={18} />
                  <Text size="sm">
                    <strong>Người đại diện:</strong> {sup.representative}
                  </Text>
                </Group>

                <Group>
                  <IconPhone size={18} />
                  <Text size="sm">
                    <strong>SĐT:</strong> {sup.phone}
                  </Text>
                </Group>

                {sup.email && (
                  <Group>
                    <IconMail size={18} />
                    <Text size="sm">
                      <strong>Email:</strong> {sup.email}
                    </Text>
                  </Group>
                )}

                <Group align="start">
                  <IconMapPin size={18} style={{ marginTop: 2 }} />
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {sup.address}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  );
}
