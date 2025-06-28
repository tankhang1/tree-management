import {
  Badge,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Image,
  Grid,
  Paper,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLeaf,
  IconDroplet,
  IconCalendarTime,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PlantManagementTreeDetailPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      id: "CT001",
      name: "Sầu riêng Ri6",
      type: "Cây ăn trái",
      note: "Ưa đất thịt, thoát nước tốt.",
      seedCode: "SR-RI6",
      seedName: "Giống Ri6",
      supplier: "Công ty Nông sản Việt",
      origin: "Việt Nam",
      germinationRate: "85",
      yield: "25",
      seedNote: "Giống được kiểm định bởi Bộ NN&PTNT.",
      seedDoc: null,
      harvestMethod: "Theo quả",
      growthCycle: "Trung bình 3 năm",
      growthStages: [
        "Ươm giống",
        "Trồng cây con",
        "Chăm sóc sinh trưởng",
        "Ra hoa",
        "Kết trái",
      ],
      growthTime: "1095",
      growthNote: "Cần tỉa cành định kỳ và phòng ngừa sâu bệnh.",
    },
  });

  return (
    <Card withBorder shadow="md" radius={4} p="xl">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3} c="green.8">
          🌳 Chi tiết cây trồng
        </Title>
      </Group>

      <Grid gutter={40}>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Image
            src="https://images.prismic.io/queenfarm/Z5YODpbqstJ992qW__550x550-cr_sau-rieng-57-removebg-preview.png?auto=format%2Ccompress&fit=max&w=3840"
            radius="md"
            h={350}
            alt="Hình ảnh cây trồng"
            fit="contain"
          />
          <Paper p="sm" radius={4} withBorder>
            <Text size="lg" fw={600} mb={4}>
              Thông tin chung
            </Text>
            <Group justify="space-between">
              <Text>Mã cây:</Text>
              <Text>{form.values.id}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Tên cây:</Text>
              <Text>{form.values.name}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Loại cây:</Text>
              <Badge color="teal" size="sm">
                {form.values.type}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text>Ghi chú:</Text>
              <Text>{form.values.note}</Text>
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Divider
              label={
                <Group>
                  <IconLeaf size={16} /> Thông tin hạt giống
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Mã giống:</Text>
                <Text>{form.values.seedCode}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Tên giống:</Text>
                <Text>{form.values.seedName}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Nhà cung cấp:</Text>
                <Text>{form.values.supplier}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Xuất xứ:</Text>
                <Text>{form.values.origin}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Tỷ lệ nảy mầm:</Text>
                <Text>{form.values.germinationRate}%</Text>
              </Group>
              <Group justify="space-between">
                <Text>Năng suất:</Text>
                <Text>{form.values.yield} tấn/ha</Text>
              </Group>
              <Group align="flex-start">
                <Text>Mô tả:</Text>
                <Text>{form.values.seedNote}</Text>
              </Group>
            </Paper>

            <Divider
              label={
                <Group>
                  <IconDroplet size={16} /> Hình thức thu hoạch
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Phương pháp:</Text>
                <Text>{form.values.harvestMethod}</Text>
              </Group>
            </Paper>

            <Divider
              label={
                <Group>
                  <IconCalendarTime size={16} /> Chu kỳ sinh trưởng
                </Group>
              }
              labelPosition="left"
            />

            <Paper p="sm" radius={4} withBorder>
              <Group justify="space-between">
                <Text>Chu kỳ:</Text>
                <Text>{form.values.growthCycle}</Text>
              </Group>
              <Group align="center" justify="space-between">
                <Text mr="sm">Giai đoạn:</Text>
                <Group gap={4}>
                  {form.values.growthStages.map((s, i) => (
                    <Badge key={i} size="xs" variant="light">
                      {s}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Group justify="space-between">
                <Text>Thời gian:</Text>
                <Text>{form.values.growthTime} ngày</Text>
              </Group>
              <Group justify="space-between" align="flex-start">
                <Text>Điều kiện đặc thù:</Text>
                <Text>{form.values.growthNote}</Text>
              </Group>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default PlantManagementTreeDetailPage;
