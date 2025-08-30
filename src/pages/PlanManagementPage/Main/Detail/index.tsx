import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBox,
  IconTool,
  IconVaccine,
  IconArrowLeft,
  IconClockHour4,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { ResourceCard, TagList, type Resource } from "../../Assign/Detail";
import Scrollable from "../../../../components/Scrollable";

// 🔸 Dữ liệu mẫu cho trang chi tiết
const mockPlan = {
  seasonName: "Mùa Xuân 2025",
  startDate: "01/01/2025",
  endDate: "30/04/2025",
  zone: "Vùng Trồng Tây Nguyên",
  area: "Khu vực Buôn Hồ",
  plot: "Lô A1-01",
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

const PlanManagementMainDetailPage = () => {
  const plan = mockPlan; // hoặc gọi API để lấy theo id
  const navigate = useNavigate();
  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        {/* Tiêu đề */}
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Chi tiết kế hoạch mùa vụ</Title>
        </Group>
        {/* Thông tin mùa vụ */}
        <Title order={4}>Thông tin kế hoạch</Title>
        <Group>
          <Text>
            <strong>Mùa vụ:</strong> {plan.seasonName}
          </Text>
        </Group>

        <Divider label="Địa điểm canh tác" labelPosition="center" my="md" />

        <Card withBorder radius="md" shadow="xs" p="md">
          <Stack gap="md">
            {/* VÙNG TRỒNG */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Vùng trồng
                </Title>
                <Badge color="blue" variant="light">
                  VT-001
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Vùng Trồng Tây Nguyên
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Diện tích:</strong> 50.000 m²
                </Text>
                <Text size="sm">
                  <strong>Loại đất:</strong> Đất đỏ bazan
                </Text>
                <Text size="sm">
                  <strong>Địa hình:</strong> Cao, Thoai thoải
                </Text>
              </Group>
            </Stack>

            <Divider label="Khu vực" labelPosition="left" />

            {/* KHU VỰC */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Khu vực
                </Title>
                <Badge color="green" variant="light">
                  KV-TN1
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Khu vực Buôn Hồ
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Đơn vị quản lý:</strong> HTX Cà phê Buôn Ma Thuột
                </Text>
                <Text size="sm">
                  <strong>Người quản lý:</strong> Nguyễn Văn Tài
                </Text>
                <Text size="sm">
                  <strong>Diện tích:</strong> 15.000 m²
                </Text>
              </Group>
            </Stack>

            <Divider label="Lô" labelPosition="left" />

            {/* LÔ */}
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={5} mb={0}>
                  Lô
                </Title>
                <Badge color="green" variant="light">
                  LO-A1-01
                </Badge>
              </Group>
              <Text size="sm">
                <strong>Tên:</strong> Lô A1-01
              </Text>
              <Group gap="xl">
                <Text size="sm">
                  <strong>Loại cây:</strong> Sầu riêng Monthong
                </Text>
                <Text size="sm">
                  <strong>Số lượng cây:</strong> 120
                </Text>
                <Text size="sm">
                  <strong>Diện tích:</strong> 3.000 m²
                </Text>
                <Text size="sm">
                  <strong>Trạng thái:</strong>{" "}
                  <Badge color="green">Đang canh tác</Badge>
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Divider label="Thông tin mùa vụ" labelPosition="center" />

        {/* Danh sách chu kỳ */}
      {mockPlan.cycles.map((cycle) => (
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
    </Card>
  );
};

export default PlanManagementMainDetailPage;
