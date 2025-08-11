import {
  Badge,
  Card,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import {
  IconMapPin,
  IconClipboardText,
  IconLayersSubtract,
  IconClockHour4,
  IconUser,
  IconUsers,
  IconTool,
  IconVaccine,
  IconBox,
} from "@tabler/icons-react";
import Scrollable from "../../../../../components/Scrollable";

/* --- Small UI helpers --- */
function InfoRow({
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
      <span style={{ display: "inline-flex", width: rem(18) }}>{icon}</span>
      <Text fw={600} fz="sm">
        {label}
      </Text>
      <Text fz="sm">{value}</Text>
    </Group>
  );
}

function TagList({
  icon,
  items,
  color = "indigo",
  emptyText = "Không có",
}: {
  icon: React.ReactNode;
  items: string[];
  color?: string;
  emptyText?: string;
}) {
  return (
    <Group gap={6} wrap="wrap">
      <ThemeIcon color={color} variant="light" radius="md">
        {icon}
      </ThemeIcon>
      {items.length ? (
        items.map((t) => (
          <Badge key={t} variant="light" color={color}>
            {t}
          </Badge>
        ))
      ) : (
        <Text c="dimmed" fz="sm">
          {emptyText}
        </Text>
      )}
    </Group>
  );
}
type Resource = {
  type: "Vật tư" | "Thuốc BVTV" | "Thiết bị";
  name: string;
  quantity: number;
  unit: string;
  img: string;
};

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
      w={"100%"}
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

const ConfirmStep = () => {
  const data = {
    name: "Tưới nước đợt 1",
    manager: "Nguyễn Quản Lý",
    supervisor: "Trần Thanh Tra",
    plan: "KH-XUAN-01",
    season: "Mùa Xuân 2025",
    treeGroup: "Cây ngắn ngày",
    treeCategory: "Rau cải",
    crop: "Rau muống",
    cropCode: "RAU-001",
    cropVariety: "Rau muống lá nhỏ",
    cropSeed: "RMLN-2025",
    cropImage:
      "https://food-map.s3.ap-southeast-1.amazonaws.com/news/2021/03/sau-rieng-ri6-3.jpg",
    cropDescription:
      "Loại rau muống sinh trưởng nhanh, phù hợp với vùng đất ẩm. Có thể thu hoạch sau 45 ngày.",
    harvestUnit: "kg",
    duration: 45,
    zone: "Vùng Trồng Tây Nguyên",
    area: "Khu vực Buôn Hồ",
    plot: "Lô A1-01",
    startDate: "15/02/2025",
    endDate: "19/02/2025",
    cycles: [
      {
        name: "Chu kỳ 1",
        stages: [
          {
            name: "Nảy mầm",
            duration: 5,
            documentType: "file" as "file" | "editor",
            document: "Tài liệu gieo hạt.pdf",
            materials: ["Phân NPK"],
            equipment: ["Bình tưới"],
            pesticides: [],
            leader: "Nguyễn Văn A",
            members: ["Nguyễn Văn A", "Trần Thị B"],
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
          },
          {
            name: "Ra hoa",
            duration: 10,
            documentType: "editor" as "file" | "editor",
            document: "Giai đoạn ra lá cần đủ ánh sáng và độ ẩm.",
            materials: ["Vôi bột"],
            equipment: ["Máy xịt"],
            pesticides: ["Confidor"],
            leader: "Trần Thị B",
            members: ["Lê Văn C"],
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
          },
        ],
      },
    ],
  };

  return (
    <Stack>
      <Title order={3}>Xác nhận công việc canh tác</Title>

      {/* Top summary */}
      <Group grow align="stretch">
        {/* Thông tin chung */}
        <Card withBorder radius={4} p="md" style={{ flex: 1 }}>
          <Stack gap={8}>
            <InfoRow
              icon={<IconClipboardText size={18} />}
              label="Tên công việc:"
              value={data.name}
            />
            <InfoRow
              icon={<IconClipboardText size={18} />}
              label="Kế hoạch:"
              value={data.plan}
            />
            <InfoRow
              icon={<IconClipboardText size={18} />}
              label="Mùa vụ:"
              value={data.season}
            />
            <InfoRow
              icon={<IconUser size={18} />}
              label="Người quản lý:"
              value={data.manager}
            />
            <InfoRow
              icon={<IconUser size={18} />}
              label="Người kiểm định chất lượng:"
              value={data.supervisor}
            />
            <InfoRow
              icon={<IconClockHour4 size={18} />}
              label="Thời gian thực hiện dự kiến:"
              value={data.startDate}
            />
            <InfoRow
              icon={<IconClockHour4 size={18} />}
              label="Thời gian hoàn thành dự kiến:"
              value={data.endDate}
            />
          </Stack>

          <Divider my="sm" />

          <Group gap="md">
            <InfoRow
              icon={<IconMapPin size={18} />}
              label="Vùng:"
              value={data.zone}
            />
            <InfoRow
              icon={<IconLayersSubtract size={18} />}
              label="Khu vực:"
              value={data.area}
            />
            <InfoRow
              icon={<IconClipboardText size={18} />}
              label="Lô:"
              value={data.plot}
            />
          </Group>
        </Card>

        {/* Cây trồng */}
        <Card withBorder radius={4} p="md" style={{ flex: 1 }}>
          <Group align="flex-start" justify="space-between" wrap="nowrap">
            <Stack gap={6} style={{ minWidth: 0 }}>
              <Group gap="xs" wrap="wrap">
                <Badge variant="light" color="green">
                  {data.treeGroup}
                </Badge>
                <Badge variant="light" color="teal">
                  {data.treeCategory}
                </Badge>
                <Badge variant="light" color="blue">
                  Mã: {data.cropCode}
                </Badge>
              </Group>
              <Text fw={600}>{data.crop}</Text>
              <Text c="dimmed" fz="sm">
                Giống: {data.cropVariety} • Hạt giống: {data.cropSeed}
              </Text>
              <Text fz="sm" lineClamp={3}>
                {data.cropDescription}
              </Text>
              <Badge variant="outline" color="gray" mt={4}>
                Đơn vị thu hoạch: {data.harvestUnit}
              </Badge>
            </Stack>

            <Image
              src={data.cropImage}
              h={180}
              w={240}
              radius="md"
              alt={`${data.crop}`}
              fit="cover"
              style={{ flexShrink: 0 }}
            />
          </Group>
        </Card>
      </Group>

      <Divider
        label="Danh sách chu kỳ và giai đoạn"
        labelPosition="center"
        my="md"
      />

      {/* Cycles & stages */}
      {data.cycles.map((cycle) => (
        <Stack key={cycle.name} gap="lg">
          <Title order={4}>{cycle.name}</Title>

          <Scrollable h={600}>
            <Group wrap="nowrap" align="stretch">
              {cycle.stages.map((stage) => (
                <Card
                  key={`${cycle.name}-${stage.name}`}
                  shadow="sm"
                  w={700}
                  withBorder
                  radius={4}
                  p="md"
                >
                  <Stack gap="xs">
                    {/* Header */}
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon color="blue" variant="light" radius="md">
                          <IconClockHour4 size={18} />
                        </ThemeIcon>
                        <Text fw={700}>
                          {stage.name} ({stage.duration} ngày)
                        </Text>
                      </Group>
                      <Badge variant="light" color="blue">
                        {cycle.name}
                      </Badge>
                    </Group>

                    {/* Leader */}
                    <Divider label="Trưởng nhóm" labelPosition="left" />
                    <Group>
                      <ThemeIcon color="teal" variant="light" radius="md">
                        <IconUser size={16} />
                      </ThemeIcon>
                      <Text size="sm">{stage.leader || "Chưa chọn"}</Text>
                    </Group>

                    {/* Members */}
                    <Divider label="Nhân sự" labelPosition="left" />
                    <TagList
                      icon={<IconUsers size={16} />}
                      items={stage.members}
                      color="indigo"
                      emptyText="Chưa có nhân sự"
                    />

                    {/* Materials / Equipment / Pesticides (danh sách tên) */}
                    <Divider label="Hạng mục sử dụng" labelPosition="left" />

                    {/* Resources (có số lượng) */}
                    {stage.resources?.length ? (
                      <>
                        <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
                          {stage.resources.map((r, i) => (
                            <ResourceCard key={i} r={r} />
                          ))}
                        </SimpleGrid>
                      </>
                    ) : null}
                  </Stack>
                </Card>
              ))}
            </Group>
          </Scrollable>
        </Stack>
      ))}
    </Stack>
  );
};

export default ConfirmStep;
