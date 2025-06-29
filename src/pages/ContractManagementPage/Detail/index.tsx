import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  Grid,
  Button,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconCoin,
  IconFileDescription,
  IconPackage,
  IconSettings,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const ContractManagementDetailPage = () => {
  const navigate = useNavigate();
  const contract = {
    id: "c1",
    name: "Hợp đồng thu mua Sầu riêng",
    type: "Thu",
    summary: "Thu mua sầu riêng cho vụ mùa hè 2025",
    materials: ["Phân vi sinh A", "Chất kích thích tăng trưởng B"],
    pesticides: ["Thuốc BVTV X"],
    machines: ["Máy gặt X2"],
    quantity: 100,
    unit: "Tấn",
    value: 1200000000,
    currency: "VND",
    additionalDetail: "Vận chuyển theo từng đợt trong 3 tháng.",
    startDate: "2025-07-01",
    endDate: "2025-10-01",
    partner: "Công ty Xuất khẩu Trái cây ABC",
    file: "/files/contract-c1.pdf",
  };
  return (
    <Stack justify="center" align="center">
      <Card w={"60%"} withBorder radius={4} p="xl" shadow="md">
        <Stack gap="lg">
          <Group mb={"md"}>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>📄 Thông tin chi tiết hợp đồng</Title>
          </Group>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <Text fw={600}>Tên hợp đồng</Text>
              <Text size="sm">{contract.name}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>Loại hợp đồng</Text>
              <Badge
                color={contract.type === "Mua" ? "green" : "blue"}
                variant="light"
              >
                {contract.type}
              </Badge>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Đối tác / Khách hàng</Text>
              <Text size="sm">{contract.partner}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>Hiệu lực</Text>
              <Text size="sm">
                <IconCalendar size={14} style={{ marginRight: 6 }} />
                {contract.startDate} → {contract.endDate}
              </Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text fw={600}>Sản lượng</Text>
              <Text size="sm">
                {contract.quantity} {contract.unit}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>Giá trị hợp đồng</Text>
              <Text size="sm">
                <IconCoin size={14} style={{ marginRight: 6 }} />{" "}
                {new Intl.NumberFormat("vi").format(contract.value)}{" "}
                {contract.currency}
              </Text>
            </Grid.Col>
          </Grid>

          <Divider
            label={<Text fw={600}>📌 Tóm tắt</Text>}
            labelPosition="left"
            my="sm"
          />
          <Text size="sm" c="dimmed">
            {contract.summary}
          </Text>

          {contract.additionalDetail && (
            <>
              <Divider
                label={<Text fw={600}>📘 Chi tiết bổ sung</Text>}
                labelPosition="left"
                my="sm"
              />
              <Text size="sm" c="dimmed">
                {contract.additionalDetail}
              </Text>
            </>
          )}

          <Divider
            label={<Text fw={600}>🧰 Tài nguyên liên quan</Text>}
            labelPosition="left"
            my="sm"
          />
          <Group align="flex-start" gap="xl">
            <Stack gap="xs">
              <Group>
                <IconPackage size={16} />
                <Text fw={600}>Vật tư</Text>
              </Group>
              {contract.materials?.map((item: string, idx: number) => (
                <Badge key={idx} color="gray" variant="light">
                  {item}
                </Badge>
              ))}
            </Stack>
            <Stack gap="xs">
              <Group>
                <IconSettings size={16} />
                <Text fw={600}>Thuốc BVTV</Text>
              </Group>
              {contract.pesticides?.map((item: string, idx: number) => (
                <Badge key={idx} color="red" variant="light">
                  {item}
                </Badge>
              ))}
            </Stack>
            <Stack gap="xs">
              <Group>
                <IconTruckDelivery size={16} />
                <Text fw={600}>Máy móc</Text>
              </Group>
              {contract.machines?.map((item: string, idx: number) => (
                <Badge key={idx} color="green" variant="light">
                  {item}
                </Badge>
              ))}
            </Stack>
          </Group>

          {contract.file && (
            <>
              <Divider
                label={<Text fw={600}>📁 Tệp đính kèm</Text>}
                labelPosition="left"
                my="sm"
              />
              <Button
                component="a"
                target="_blank"
                leftSection={<IconFileDescription size={16} />}
                variant="light"
                radius={8}
              >
                Xem tệp đính kèm
              </Button>
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default ContractManagementDetailPage;
