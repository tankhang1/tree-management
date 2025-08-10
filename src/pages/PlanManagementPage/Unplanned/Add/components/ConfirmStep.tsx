import {
  Badge,
  Card,
  Divider,
  Group,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
  rem,
  Image,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconClipboardText,
  IconFileDescription,
  IconMapPin,
  IconTool,
  IconUser,
  IconUsersGroup,
  IconVaccine,
  IconBox,
} from "@tabler/icons-react";
import { useMemo } from "react";

type Resource = {
  type: "Vật tư" | "Thuốc BVTV" | "Thiết bị";
  name: string;
  quantity: number;
  unit: string;
  img: string;
};

const data = {
  name: "Phun thuốc sâu vụ hè",
  manager: "Nguyễn Quản Lý",
  supervisor: "Lê Kiểm Tra",
  plan: "Không có kế hoạch cụ thể",
  season: "Mùa Hè 2025",
  cycle: "Chu kỳ 1",
  stage: "Gieo trồng",
  departments: ["Chăm sóc cây", "Phòng BVTV"],
  employees: ["Nguyễn Văn A", "Trần Thị B"],
  resources: [
    {
      type: "Thiết bị",
      name: "Máy cày Kubota L3218",
      quantity: 3,
      unit: "cái",
      img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
    },
    {
      type: "Thiết bị",
      name: "Máy bay nông nghiệp DJI Agras",
      quantity: 1,
      unit: "cái",
      img: "https://agridrone.vn/wp-content/uploads/2023/02/16887_T50_%E6%AD%A3%E4%BE%A7.jpg",
    },
    {
      type: "Vật tư",
      name: "Béc tưới nhỏ giọt 8L/h",
      quantity: 1200,
      unit: "cái",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXj6nfv7JlBEuVoQo0o9DUUXGAnLXXec-JLg&s",
    },
    {
      type: "Vật tư",
      name: "Ống HDPE Φ16",
      quantity: 800,
      unit: "m",
      img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/348/321/products/ong-hdpe-wata-20.jpg?v=1669780765193",
    },
    {
      type: "Thuốc BVTV",
      name: "Thuốc trừ sâu Emamectin 5%",
      quantity: 40,
      unit: "chai",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV9s4k_p9Y4CZNPLFlRhbQPc4GZZvVNSoGVg&s",
    },
    {
      type: "Thuốc BVTV",
      name: "Thuốc trừ nấm Mancozeb 80WP",
      quantity: 8,
      unit: "gói",
      img: "https://nongduochai.vn/images/products/2021/04/13/original/manozeb-80wp_xanh_1kg_1618288208.png",
    },
  ] as Resource[],
};

/* Hàng thông tin (icon + nhãn + giá trị) */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Group align="center" gap="xs" wrap="nowrap">
      <span
        style={{ display: "inline-flex", alignItems: "center", width: rem(18) }}
      >
        {icon}
      </span>
      <Text fw={600} fz="sm" c="dark">
        {label}
      </Text>
      <Text fz="sm">{value}</Text>
    </Group>
  );
}

function ResourceCard({ r }: { r: Resource }) {
  const icon =
    r.type === "Vật tư" ? (
      <IconBox size={16} />
    ) : r.type === "Thuốc BVTV" ? (
      <IconVaccine size={16} />
    ) : (
      <IconTool size={16} />
    );

  return (
    <Paper
      withBorder
      radius={4}
      p="sm"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dải màu trái */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      <Group gap="sm" align="flex-start" wrap="nowrap">
        <Image
          src={r.img || "https://via.placeholder.com/100x100?text=No+Image"}
          alt={r.name}
          w={80}
          h={80}
          radius="sm"
          fit="cover"
        />

        <Stack gap={4} flex={1}>
          <Group gap={6} align="center">
            {icon}
            <Text fw={600} fz="sm">
              {r.type}
            </Text>
          </Group>
          <Text>{r.name}</Text>
          <Text c="dimmed" fz="sm">
            {r.quantity} {r.unit}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}

export default function ConfirmStep() {
  const resourceTotals = useMemo(
    () => ({
      count: data.resources.length,
      quantity: data.resources.reduce((s, x) => s + x.quantity, 0),
    }),
    []
  );

  return (
    <Stack gap="lg">
      {/* Header */}
      <Stack gap={4}>
        <Title order={3}>Xác nhận công việc phát sinh</Title>
        <Text c="dimmed" fz="sm">
          Vui lòng kiểm tra thông tin trước khi tạo công việc
        </Text>
      </Stack>

      {/* Thông tin chung */}
      <Card withBorder p="lg" radius={4} shadow="sm">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm">
              <InfoItem
                icon={<IconClipboardText size={18} />}
                label="Tên công việc:"
                value={data.name}
              />
              <InfoItem
                icon={<IconCalendarEvent size={18} />}
                label="Mùa vụ:"
                value={data.season}
              />
              <InfoItem
                icon={<IconFileDescription size={18} />}
                label="Kế hoạch:"
                value={data.plan}
              />
              <InfoItem
                icon={<IconUser size={18} />}
                label="Người quản lý:"
                value={data.manager}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Stack gap="sm">
              <InfoItem
                icon={<IconUser size={18} />}
                label="Người kiểm định chất lượng:"
                value={data.supervisor}
              />
              <InfoItem
                icon={<IconMapPin size={18} />}
                label="Chu kỳ sinh trưởng:"
                value={data.cycle}
              />
              <InfoItem
                icon={<IconMapPin size={18} />}
                label="Giai đoạn sinh trưởng:"
                value={data.stage}
              />

              <Stack gap={6}>
                <Group gap="xs" align="center" wrap="nowrap">
                  <IconUsersGroup size={18} />
                  <Text fw={600} fz="sm">
                    Phòng ban tham gia:
                  </Text>
                </Group>
                <Group gap={6} wrap="wrap">
                  {data.departments.map((d, i) => (
                    <Badge key={i} variant="light" color="blue">
                      {d}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Stack gap={6}>
          <Group gap="xs" align="center" wrap="nowrap">
            <IconUsersGroup size={18} />
            <Text fw={600} fz="sm">
              Nhân sự tham gia:
            </Text>
          </Group>
          <Group gap={6} wrap="wrap">
            {data.employees.map((e, i) => (
              <Badge key={i} variant="outline">
                {e}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Card>

      {/* Tài sản sử dụng */}
      <Divider
        label={
          <Group gap="xs">
            <Text fw={700}>Tài sản sử dụng</Text>
            <Badge variant="light" color="teal">
              {resourceTotals.count} mục
            </Badge>
            <Badge variant="light" color="gray">
              Tổng SL: {resourceTotals.quantity}
            </Badge>
          </Group>
        }
        labelPosition="center"
        my="md"
      />

      <Card withBorder p="lg" radius={4} shadow="sm">
        <Grid gutter="sm">
          {data.resources.map((r, i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6 }}>
              <ResourceCard r={r} />
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    </Stack>
  );
}
